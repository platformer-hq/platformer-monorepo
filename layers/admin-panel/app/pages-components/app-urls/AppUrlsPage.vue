<script setup lang="ts">
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { openLink } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';

import HttpWarning from './_components/HttpWarning.vue';
import { AppUrlsPageDataDocument, UpdateAppUrlsDocument } from './operations';

const { e } = bem('app-urls-page');

const { t } = useI18n({
  messages: {
    en: {
      'singleUrl.title': 'Single URL',
      'singleUrl.placeholder': 'optional',
      'singleUrl.footer': 'This URL will be applied to all Telegram clients.',
      'platform.placeholder': 'optional',
      'telegram.footer': 'List of URLs applicable to the Telegram mini-apps platform.',
      learnMore: 'Learn more about URLs',
      'button.apply': 'Apply changes',
      'button.singleUrlInvalid': 'URL is invalid',
      'button.platformUrlInvalid': 'Invalid URL in {platform}',
    },
    ru: {
      'singleUrl.title': 'Единая ссылка',
      'singleUrl.placeholder': 'опционально',
      'singleUrl.footer': 'Эта ссылка будет применена ко всем клиентам Telegram.',
      'platform.placeholder': 'опционально',
      'telegram.footer': 'Список ссылок, применимых к платформе мини-приложений Telegram.',
      learnMore: 'Подробнее о ссылках',
      'button.apply': 'Применить изменения',
      'button.singleUrlInvalid': 'Ссылка невалидна',
      'button.platformUrlInvalid': 'Невалидная ссылка для {platform}',
    },
  },
});

const platform = useTmaPlatform();
const isPageEntered = useIsCurrentPageEntered();
const appId = useQueryAppId();
const request = useMakeGqlApiRequest();
const queryCache = useQueryCache();
const queryOptions = defineQueryOptions((appId: number) => ({
  key: [AppUrlsPageDataDocument, appId],
  query: throwify(() => {
    return fp.function.pipe(
      request(AppUrlsPageDataDocument, { appId }),
      fp.taskEither.map(({ app, platforms }) => {
        return {
          app: app
            ? {
              role: apiAppRoleToLocal(app.currentUserRole),
              urls: app.urls.map(u => ({
                platformId: u.platform.id,
                url: u.url,
              })),
            }
            : undefined,
          platforms: platforms.map(p => ({
            id: p.id,
            title: p.title,
            vendor: p.vendor.title,
          })),
        };
      }),
    );
  }),
}));
const { data: pageData, isPending: isPageDataPending } = useQuery(() => queryOptions(appId.value));
const { mutate: updateUrls, isLoading: isUpdatingUrls } = useMutation({
  key: [UpdateAppUrlsDocument],
  mutation(options: {
    appId: number;
    urls: { platformId: number; url: string }[];
  }) {
    return throwifyAnyEither(
      fp.function.pipe(
        request(UpdateAppUrlsDocument, {
          appId: options.appId,
          urls: options.urls.map(u => ({ platformID: u.platformId, url: u.url })),
        }),
        fp.taskEither.map(response => response.updateApp.urls),
      ),
    );
  },
  onSuccess(newUrls, { appId }) {
    hapticNotificationOccurred('success');
    const queryKey = queryOptions(appId).key;
    const queryData = queryCache.getQueryData(queryKey);
    if (queryData?.app) {
      queryCache.setQueryData(queryKey, {
        ...queryData,
        app: {
          ...queryData.app,
          urls: newUrls.map(item => ({
            platformId: item.platform.id,
            url: item.url,
          })),
        },
      });
    }
  },
  onError() {
    // TODO: Popup
    hapticNotificationOccurred('error');
  },
});

const isSingleUrl = ref(false);
const singleUrl = ref('');
const urls = ref<{ [platformId: number]: string }>({});

const vendors = computed(() => {
  return pageData.value
    ? pageData.value.platforms.reduce<{
      title: string;
      platforms: {
        id: number;
        title: string;
      }[];
    }[]>((acc, platform) => {
      const vendor = acc.find(item => item.title === platform.vendor);
      const vendorPlatform = { id: platform.id, title: platform.title };
      if (vendor) {
        vendor.platforms.push(vendorPlatform);
      } else {
        acc.push({ title: platform.vendor, platforms: [vendorPlatform] });
      }
      return acc;
    }, [])
    : undefined;
});
const controlsEnabled = computed(() => (
  !!pageData.value
  && !isPageDataPending.value
  && !isUpdatingUrls.value
  && pageData.value.app?.role !== 'member'
));
const showWarning = computed(() => (
  isSingleUrl.value
    ? singleUrl.value.trim().startsWith('http:')
    : Object.values(urls.value).some(v => v.trim().startsWith('http:'))
));
const isDirty = computed(() => {
  const dataUrls = pageData.value?.app?.urls;
  if (!dataUrls) {
    return false;
  }
  if (isSingleUrl.value) {
    return dataUrls.some(u => u.url !== singleUrl.value);
  }
  return Object.entries(urls.value).some(([platformId, url]) => {
    const platformIdNum = parseInt(platformId);
    const prev = dataUrls.find(item => item.platformId === platformIdNum);
    return !prev || prev.url !== url;
  });
});
const invalidUrl = computed(() => {
  if (isSingleUrl.value) {
    console.log(isValidUrl(singleUrl.value), singleUrl.value);
    return isValidUrl(singleUrl.value) ? undefined : { kind: 'single' as const };
  }
  for (const platformId in urls.value) {
    if (!isValidUrl(urls.value[platformId]!)) {
      const platform = pageData.value?.platforms.find(p => p.id === Number(platformId));
      if (platform) {
        return { kind: 'platform', platform: platform.title };
      }
    }
  }
  return undefined;
});
const isButtonEnabled = computed(() => (!isUpdatingUrls.value && !invalidUrl.value));

const docsLink = 'https://docs.mini-apps.store/separate-links';
const urlsTransition = createReversibleTransition({
  animatedProperties: { opacity: [0, 1], transform: ['scale(0.98)', 'scale(1)'] },
  animationOptions: { duration: 200, easing: 'ease-out' },
});
const handleSave = () => {
  updateUrls({
    appId: appId.value,
    urls: Object.entries(urls.value).map(([plaformId, url]) => ({
      platformId: parseInt(plaformId),
      url,
    })),
  });
};

watch(pageData, data => {
  const dataUrls = data?.app?.urls;
  if (!dataUrls) {
    return;
  }
  const urlsOnly = dataUrls.map(u => u.url);
  const single = urlsOnly.every(u => (u || '') === (urlsOnly[0] || ''));
  isSingleUrl.value = single;
  singleUrl.value = (single ? urlsOnly[0] : undefined) || '';
  urls.value = dataUrls.reduce<Record<number, string>>((acc, item) => {
    acc[item.platformId] = item.url;
    return acc;
  }, {});
}, { immediate: true });

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_APP });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <AutoList>
            <AutoListItem
              :clickable="platform.isMappedAndroid && controlsEnabled"
              @click="platform.isMappedAndroid && controlsEnabled && (isSingleUrl = !isSingleUrl)"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('singleUrl.title') }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyRight>
                <AutoListItemBodyRight>
                  <AutoSwitch
                    v-model:checked="isSingleUrl"
                    :disabled="!controlsEnabled"
                    @click.stop
                    @mousedown.stop
                  />
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>

        <Transition v-bind="urlsTransition" :css="false" mode="out-in">
          <AutoLoadingIndicator v-if="!pageData" :class="e('loader')" :size="24"/>
          <div v-else-if="isSingleUrl" :class="e('state')">
            <AutoSection list-bg-color="section-bg" :class="e('section')">
              <AutoList>
                <AutoListItem>
                  <template #bodyLeftInput>
                    <AutoListItemBodyLeftInput>
                      <AutoListItemBodyLeftInputElement
                        v-model.trim="singleUrl"
                        :placeholder="t('singleUrl.placeholder')"
                        :disabled="!controlsEnabled"
                      />
                    </AutoListItemBodyLeftInput>
                  </template>
                </AutoListItem>
              </AutoList>
              <template #footer>
                <AutoSectionFooter v-if="isSingleUrl">
                  {{ t('singleUrl.footer') }}
                  <a :class="e('more')" :href="docsLink" @click.prevent="openLink(docsLink)">
                    {{ t('learnMore') }}
                  </a>
                </AutoSectionFooter>
              </template>
            </AutoSection>
            <HttpWarning :show="showWarning"/>
          </div>
          <div v-else :class="e('state')">
            <AutoSection
              v-for="vendor in vendors"
              :key="vendor.title"
              list-bg-color="section-bg"
              :class="e('section')"
            >
              <template #header>
                <AutoSectionHeader>
                  {{ vendor.title }}
                </AutoSectionHeader>
              </template>
              <AutoList>
                <AutoListItem v-for="item in vendor.platforms" :key="item.id">
                  <template #left>
                    <AutoListItemLeft :width="80">
                      <AutoListItemLeftLabel>
                        {{ item.title }}
                      </AutoListItemLeftLabel>
                    </AutoListItemLeft>
                  </template>
                  <template #bodyLeftInput>
                    <AutoListItemBodyLeftInput>
                      <AutoListItemBodyLeftInputElement
                        :model-value="urls[item.id]"
                        :placeholder="t('singleUrl.placeholder')"
                        :disabled="!controlsEnabled"
                        @update:model-value="urls[item.id] = $event?.trim() || ''"
                      />
                    </AutoListItemBodyLeftInput>
                  </template>
                </AutoListItem>
              </AutoList>
              <template #footer>
                <AutoSectionFooter>
                  {{ t('telegram.footer') }}
                  <a :class="e('more')" :href="docsLink" @click.prevent="openLink(docsLink)">
                    {{ t('learnMore') }}
                  </a>
                </AutoSectionFooter>
              </template>
            </AutoSection>
            <HttpWarning :show="showWarning"/>
          </div>
        </Transition>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered && isDirty" ref="bottom-bar">
          <BottomBarInner>
            <AutoButton
              :palette="isButtonEnabled ? 'filled' : 'disabled'"
              full-width
              :active="isButtonEnabled"
              :disabled="!isButtonEnabled"
              @click="handleSave"
            >
              <AutoTypography variant="body" weight="semibold">
                {{ invalidUrl
                  ? invalidUrl.kind === 'single'
                    ? t('button.singleUrlInvalid')
                    : t('button.platformUrlInvalid', {platform: invalidUrl.platform})
                  : t('button.apply') }}
              </AutoTypography>
              <ButtonLoadingIndicator :show="isUpdatingUrls"/>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>

<style lang="scss">
@use "@/domains/styles/mixins";

.app-urls-page {
  &__section {
    margin-top: 16px;
  }

  &__loader {
    display: block;
    margin: 16px auto 0;
    color: var(--subtitle-text-color);
  }

  &__more {
    text-decoration: none;
    color: var(--link-color);
    @include mixins.clickable;
  }

  &__state {
    transform-origin: top center;
  }
}
</style>
