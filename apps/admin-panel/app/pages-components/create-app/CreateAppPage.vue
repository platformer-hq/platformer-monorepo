<script setup lang="ts">
import { useMutation } from '@pinia/colada';

import { CreateAppDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Application name',
      footer: 'Come up with a name for the app. It can be changed in the future',
      button: 'Create',
      placeholder: 'опционально',
    },
    ru: {
      title: 'Название приложения',
      footer: 'Придумайте название приложения. Его можно будет изменить в дальнейшем',
      button: 'Создать',
      placeholder: 'обязательно',
    },
  },
});
const isPageEntered = useIsPageEntered(PageNames.CreateApp);
const request = useMakeApiGqlRequest();
const { mutate: createApp, isLoading: isCreatingApp } = useMutation({
  key: [CreateAppDocument],
  mutation(options: { title: string }) {
    return throwifyAnyEither(request(CreateAppDocument, { title: options.title }));
  },
  onSuccess(data) {
    hapticNotificationOccurred('success');
    navigateToApp(data.createApp.id);
  },
  onError() {
    hapticNotificationOccurred('error');
    // TODO: Popup?
  },
});

const appName = ref('');
const isButtonEnabled = computed(() => {
  return appName.value.length > 0 && !isCreatingApp.value;
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem>
              <template #bodyLeftInput>
                <AutoListItemBodyLeftInput>
                  <AutoListItemBodyLeftInputElement
                    v-model="appName"
                    :placeholder="t('placeholder')"
                  />
                </AutoListItemBodyLeftInput>
              </template>

            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered">
          <BottomBarInner>
            <AutoButton
              full-width
              :active="isButtonEnabled"
              :disabled="!isButtonEnabled"
              :palette="isButtonEnabled ? 'filled' : 'disabled'"
              @click="createApp({title: appName})"
            >
              <AutoTypography variant="body" weight="medium">
                {{t('button')}}
              </AutoTypography>
              <ButtonLoadingIndicator :show="isCreatingApp"/>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
