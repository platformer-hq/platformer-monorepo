<script setup lang="ts">
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import * as fp from 'fp-ts';

import { AppGeneralPageDataDocument, UpdateAppDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      'id.title': 'Identifier',
      'id.footer': 'The application unique identifier',
      'title.title': 'Title',
      'title.footer': 'The public name of your application',
      'title.placeholder': 'Application title',
      'privacy.title': 'Visibility level',
      'privacy.footer': 'The visibility level determines which users can view the application',
      'privacy.public.title': 'Public',
      'privacy.public.subtitle': 'Everybody can open the app',
      'privacy.private.title': 'Private',
      'privacy.private.subtitle': 'Only managers and test groups\' users',
      'button.titleWarning': 'Title is required',
      'button.apply': 'Apply changes',
    },
    ru: {
      'id.title': 'Идентификатор',
      'id.footer': 'Уникальный идентификатор приложения',
      'title.title': 'Заголовок',
      'title.footer': 'Публичное название приложения',
      'title.placeholder': 'Название приложения',
      'privacy.title': 'Уровень видимости',
      'privacy.footer': 'Уровень видимости определяет какие пользователи могут открыть приложение',
      'privacy.public.title': 'Публичное',
      'privacy.public.subtitle': 'Приложение доступно всем',
      'privacy.private.title': 'Приватное',
      'privacy.private.subtitle': 'Только менеджерам и пользователям тестовых групп',
      'button.titleWarning': 'Заголовок обязателен',
      'button.apply': 'Применить изменения',
    },
  },
});

const appId = useQueryAppId();
const isPageEntered = useIsCurrentPageEntered();
const bottomBar = useTemplateRef('bottom-bar');

//#region Requests.
const queryCache = useQueryCache();
const request = useMakeGqlApiRequest();
const { data } = useQuery({
  key: () => [AppGeneralPageDataDocument, appId],
  query: throwify(() => {
    return fp.function.pipe(
      request(AppGeneralPageDataDocument, { appId: appId.value }),
      fp.taskEither.map(({ app }) => (
        app
          ? {
            title: app.title,
            privacy: apiAppPrivacyToLocal(app.privacy),
            role: apiAppRoleToLocal(app.currentUserRole),
          }
          : null
      )),
    );
  }),
});
const { mutate: updateApp, isLoading: isUpdatingApp } = useMutation({
  key: [UpdateAppDocument],
  mutation(options: { appId: number; privacy: LocalPrivacy; title: string }) {
    return throwifyAnyEither(
      fp.function.pipe(
        request(UpdateAppDocument, {
          appId: options.appId,
          privacy: localAppPrivacyToApi(options.privacy),
          title: options.title,
        }),
        fp.taskEither.map(response => response.updateApp),
      ),
    );
  },
  onSuccess({ privacy, title }) {
    hapticNotificationOccurred('success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryCache.setQueryData([AppGeneralPageDataDocument, appId], (data: any) => (
      data
        ? { ...data, privacy: apiAppPrivacyToLocal(privacy), title }
        : data
    ));
  },
  onError() {
    // TODO: popup
    hapticNotificationOccurred('error');
  },
});
//#endregion

const privacy = ref<LocalPrivacy>(data.value?.privacy || 'public');
const title = ref(data.value?.title.trim() || '');

const privacyLevels = computed(() => [{
  title: t('privacy.public.title'),
  subtitle: t('privacy.public.subtitle'),
  value: 'public' as const,
}, {
  title: t('privacy.private.title'),
  subtitle: t('privacy.private.subtitle'),
  value: 'private' as const,
}]);
const isDirty = computed(() => {
  return privacy.value !== data.value?.privacy
    || title.value.trim() !== data.value.title.trim();
});
const isButtonDisabled = computed(() => (isUpdatingApp.value || !title.value));

watch(data, data => {
  if (data) {
    privacy.value = data.privacy;
    title.value = data.title.trim();
  }
});

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_APP });
});
</script>

<template>
  <PageBase colors="secondary-bg">
    <PageContent :style="{paddingBottom: toPx(bottomBar?.height)}">
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('id.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem>
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ appId }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('id.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>

        <AutoSection list-bg-color="section-bg" style="margin-top: 16px">
          <template #header>
            <AutoSectionHeader>
              {{ t('title.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem>
              <template v-if="data" #bodyLeftInput>
                <AutoListItemBodyLeftInput>
                  <AutoListItemBodyLeftInputElement
                    v-model="title"
                    :placeholder="t('title.placeholder')"
                  />
                </AutoListItemBodyLeftInput>
              </template>
              <template v-else #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  <TextShimmerBox variant="body" :width="100"/>
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('title.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>

        <AutoSection list-bg-color="section-bg" style="margin-top: 16px">
          <template #header>
            <AutoSectionHeader>
              {{ t('privacy.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              v-for="item in privacyLevels"
              :key="item.value"
              large
              :clickable="!!data"
              @click="data && (privacy = item.value)"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ item.title }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyLeftSubtitle>
                <AutoListItemBodyLeftSubtitle :max-lines="1">
                  {{ item.subtitle }}
                </AutoListItemBodyLeftSubtitle>
              </template>
              <template v-if="data && privacy === item.value" #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightCheckmark/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('privacy.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <BottomBarTransition>
      <BottomBar v-if="isPageEntered && isDirty" ref="bottom-bar">
        <BottomBarInner>
          <AutoButton
            :palette="isButtonDisabled ? 'disabled' : 'filled'"
            full-width
            :active="!isButtonDisabled"
            :disabled="isButtonDisabled"
            @click="updateApp({appId, privacy, title: title.trim()})"
          >
            <AutoTypography variant="body" weight="semibold">
              {{ t(title ? 'button.apply' : 'button.titleWarning') }}
            </AutoTypography>
            <ButtonLoadingIndicator :show="isUpdatingApp"/>
          </AutoButton>
        </BottomBarInner>
      </BottomBar>
    </BottomBarTransition>
  </PageBase>
</template>
