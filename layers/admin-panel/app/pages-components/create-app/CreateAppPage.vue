<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';

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
const isPageEntered = useIsPageEntered(PAGE_NAME_CREATE_APP);
const request = useMakeGqlApiRequest();
const mutationFn = throwify((options: { title: string }) => {
  return request(CreateAppDocument, { title: options.title });
});
const { mutate: createApp, isPending: isCreatingApp } = useMutation({
  mutationKey: [CreateAppDocument],
  mutationFn,
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
  <PageBase>
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="secondary-bg">
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
    </PageContent>
  </PageBase>
</template>

<style scoped>

</style>
