<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams, showPopup } from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useMutationFn } from '@/queries/useMutationFn';
import { setAppsViewQueryData } from '@/views/AppsView/query-options';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { GraphQLError } from '@/queries/GraphQLError';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput';
import Page from '@/ui/components/Page.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import { CreateApp, type CreateAppMutation, type CreateAppMutationVariables } from './operations';

const router = useRouter();
const { t } = useI18n({
  messages: {
    en: {
      nameTitle: 'Application name',
      nameFooter: 'Come up with a name for the app. It can be changed in the future.',
      limitReachedTitle: 'Apps limit reached',
      limitReachedMessage: 'You \'ve reached your apps limit.',
      create: 'Create',
      required: 'опционально',
    },
    ru: {
      nameTitle: 'Название приложения',
      nameFooter: 'Придумайте название приложения. Его можно будет изменить в дальнейшем.',
      limitReachedTitle: 'Лимит приложений достигнут',
      limitReachedMessage: 'Вы достигли своего лимита по приложениям.',
      create: 'Создать',
      required: 'обязательно',
    },
  },
});

const client = useQueryClient();
const {
  isPending: isCreatingApp,
  mutate: createApp,
} = useMutation<CreateAppMutation, unknown, CreateAppMutationVariables>({
  mutationKey: ['create-app'],
  mutationFn: useMutationFn(CreateApp),
  onSuccess({ createApp: response }) {
    setAppsViewQueryData(client, prev => {
      if (prev) {
        prev.currentUser.apps.push({
          role: response.currentUserRole,
          app: {
            id: response.id,
            title: response.title,
            privacy: response.privacy,
          },
        });
        return prev;
      }
    });
    void router.replace('/apps');
    void router.replace(`/apps/${response.id}`);
  },
  onError(error) {
    if (GraphQLError.is(error) && error.isOfType('ERR_APPS_LIMIT_REACHED')) {
      void showPopup({
        title: t('limitReachedTitle'),
        message: t('limitReachedMessage'),
      });
    }
  },
});

const title = ref('');
const isTitleSet = computed(() => !!title.value);

watchEffect(() => {
  if (isTitleSet.value) {
    setMainButtonParams({
      isVisible: true,
      text: t('create'),
      isEnabled: !isCreatingApp.value,
      isLoaderVisible: isCreatingApp.value,
    });
    onWatcherCleanup(
      onMainButtonClick(() => {
        createApp({ title: title.value });
      }),
    );
  } else {
    setMainButtonParams({ isVisible: false });
  }
});
</script>

<template>
  <Page preserve-main-button>
    <PagePaddings>
      <List
        :title="t('nameTitle')"
        :footer="t('nameFooter')"
      >
        <ListItem>
          <template #bodyInput>
            <ListItemBodyInput
              v-model:value="title"
              :placeholder="t('required')"
            />
          </template>
        </ListItem>
      </List>
    </PagePaddings>
  </Page>
</template>

<style scoped>

</style>
