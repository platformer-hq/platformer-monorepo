<script setup lang="ts">
import * as fp from 'fp-ts';

import { UpdateAppDocument } from './operations';

const props = defineProps<{
  appId: number;
}>();

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

const isPageEntered = useIsCurrentPageEntered();

//#region Requests.
const request = useMakeApiGqlRequest();
const { options: pageDataOptions, setData: setPageData } = useAppGeneralPageQueryMeta();
const { data: pageData } = useQuery(() => pageDataOptions(props.appId));
const { mutate: updateApp, isLoading: isUpdatingApp } = useMutation({
  key: [UpdateAppDocument],
  mutation(options: { appId: number; privacy: LocalAppPrivacy; title: string }) {
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
    setPageData(props.appId, data => (
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

const privacy = ref<LocalAppPrivacy>(pageData.value?.privacy || LocalAppPrivacy.Public);
const title = ref(pageData.value?.title.trim() || '');

const privacyLevels = computed(() => [{
  title: t('privacy.public.title'),
  subtitle: t('privacy.public.subtitle'),
  value: LocalAppPrivacy.Public,
}, {
  title: t('privacy.private.title'),
  subtitle: t('privacy.private.subtitle'),
  value: LocalAppPrivacy.Private,
}]);
const isDirty = computed(() => {
  return pageData.value
    ? privacy.value !== pageData.value.privacy || title.value.trim() !== pageData.value.title.trim()
    : false;
});
const isButtonDisabled = computed(() => (isUpdatingApp.value || !title.value));

watch(pageData, data => {
  if (data) {
    privacy.value = data.privacy;
    title.value = data.title.trim();
  }
});

preloadRouteComponents({ name: PageNames.App });
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
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
              <template v-if="pageData" #bodyLeftInput>
                <AutoListItemBodyLeftInput>
                  <AutoListItemBodyLeftInputElement
                    v-model="title"
                    :placeholder="t('title.placeholder')"
                  />
                </AutoListItemBodyLeftInput>
              </template>
              <template v-else #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  <TextShimmerBox :width="100"/>
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
              :clickable="!!pageData"
              @click="pageData && (privacy = item.value)"
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
              <template v-if="pageData && privacy === item.value" #bodyRight>
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
    <template #footer>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered && isDirty">
          <BottomBarInner>
            <AutoButton
              :palette="isButtonDisabled ? 'disabled' : 'filled'"
              full-width
              :active="!isButtonDisabled"
              :disabled="isButtonDisabled"
              elevated
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
    </template>
  </PageRoot>
</template>
