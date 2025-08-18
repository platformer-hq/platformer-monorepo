<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { hapticFeedbackSelectionChanged, onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { AppPrivacy } from 'schema';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem } from 'vue-ui';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRightCheckmark from '@/ui/adapters/ListItemBodyRightCheckmark';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import { setAppsViewQueryData } from '@/views/AppsView/query-options.js';
import { setAppViewQueryData } from '@/views/AppView/query-options.js';
import { setAppGeneralViewQueryData, useAppGeneralViewQueryOptions } from './query-options';

import { UpdateApp, type UpdateAppMutation, type UpdateAppMutationVariables } from './operations';

const [, e] = bem('app-general-view');
const { t } = useI18n({
  messages: {
    en: {
      idTitle: 'Identifier',
      idFooter: 'The application unique identifier',
      titleTitle: 'Title',
      titleFooter: 'The public name of your application',
      titlePlaceholder: 'Application title',
      visibilityTitle: 'Visibility level',
      visibilityFooter: 'The visibility level determines which users can view the application',
      publicTitle: 'Public',
      publicSubtitle: 'Everybody can open the app',
      privateTitle: 'Private',
      privateSubtitle: 'Only managers and test groups\' users',
      titleRequired: 'Title is required',
      apply: 'Apply changes',
    },
    ru: {
      idTitle: 'Идентификатор',
      idFooter: 'Уникальный идентификатор приложения',
      titleTitle: 'Заголовок',
      titleFooter: 'Публичное название приложения',
      titlePlaceholder: 'Название приложения',
      visibilityTitle: 'Уровень видимости',
      visibilityFooter: 'Уровень видимости определяет какие пользователи могут открыть приложение',
      publicTitle: 'Публичное',
      publicSubtitle: 'Приложение доступно всем',
      privateTitle: 'Приватное',
      privateSubtitle: 'Только менеджерам и пользователям тестовых групп',
      titleRequired: 'Заголовок обязателен',
      apply: 'Применить изменения',
    },
  },
});

const client = useQueryClient();
const appID = useAppIDFromParams();
const { data: viewData } = useQuery(useAppGeneralViewQueryOptions(appID));
const {
  mutate: updateApp,
  isPending: isUpdatingApp,
} = useMutation<UpdateAppMutation, unknown, UpdateAppMutationVariables>({
  mutationFn: useMutationFn(UpdateApp),
  onSuccess(response, vars) {
    setAppViewQueryData([vars.appID], client, prev => {
      if (prev && prev.app) {
        prev.app.title = response.updateApp.title;
        return prev;
      }
    });

    setAppsViewQueryData(client, prev => {
      if (prev) {
        for (const app of prev.currentUser.apps) {
          if (app.app.id === vars.appID) {
            app.app.title = response.updateApp.title;
            app.app.privacy = response.updateApp.privacy;
            return prev;
          }
        }
      }
    });

    setAppGeneralViewQueryData([vars.appID], client, prev => {
      if (prev && prev.app) {
        prev.app = { ...prev.app, ...response.updateApp };
        return prev;
      }
    });
  },
});

const title = ref(viewData.value ? viewData.value.title : '');
const privacy = ref(viewData.value ? viewData.value.privacy : AppPrivacy.Hidden);
const readonly = computed(() => {
  return !!viewData.value && !isEditorAppRole(viewData.value.currentUserRole);
});
const showMainButton = computed(() => {
  return viewData.value && (
    title.value !== viewData.value.title || privacy.value !== viewData.value.privacy
  );
});

watchEffect(() => {
  if (viewData.value) {
    title.value = viewData.value.title;
    privacy.value = viewData.value.privacy;
  }
});

watchEffect(() => {
  onWatcherCleanup(onMainButtonClick(() => {
    updateApp({ appID, title: title.value, privacy: privacy.value });
  }));
});

watchEffect(() => {
  const titleSet = !!title.value;
  setMainButtonParams(showMainButton.value
    ? {
      isEnabled: !isUpdatingApp.value && titleSet,
      isLoaderVisible: isUpdatingApp.value,
      isVisible: true,
      text: t(titleSet ? 'apply' : 'titleRequired'),
    }
    : { isVisible: false });
});
</script>

<template>
  <Page preserve-main-button>
    <PagePaddings>
      <PageLoading v-if="!viewData" />
      <template v-else>
        <List
          :class="e('list', 'first')"
          :title="t('idTitle')"
        >
          <ListItem>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ viewData.id }}
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
          <template #footer>
            {{ t('idFooter') }}
          </template>
        </List>

        <List
          :class="e('list')"
          :title="t('titleTitle')"
        >
          <ListItem>
            <template #bodyInput>
              <ListItemBodyInput
                v-model:value="title"
                :placeholder="t('titlePlaceholder')"
                :disabled="readonly"
                required
              />
            </template>
          </ListItem>
          <template #footer>
            {{ t('titleFooter') }}
          </template>
        </List>

        <List
          :class="e('list')"
          :title="t('visibilityTitle')"
        >
          <ListItem
            v-for="item in [
              {
                privacy: AppPrivacy.Visible,
                title: t('publicTitle'),
                subtitle: t('publicSubtitle')
              },
              {
                privacy: AppPrivacy.Hidden,
                title: t('privateTitle'),
                subtitle: t('privateSubtitle')
              },
            ]"
            :key="item.privacy"
            large
            :clickable="!readonly"
            @click="
              hapticFeedbackSelectionChanged();
              privacy = item.privacy;
            "
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ item.title }}
              </ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle>
                {{ item.subtitle }}
              </ListItemBodyLeftSubtitle>
            </template>
            <template
              v-if="item.privacy === privacy"
              #bodyRightCheckmark
            >
              <ListItemBodyRightCheckmark />
            </template>
          </ListItem>
          <template #footer>
            {{ t('visibilityFooter') }}
          </template>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.app-general-view__list {
  margin: 8px 0;

  &--first {
    margin-top: 0;
  }
}
</style>
