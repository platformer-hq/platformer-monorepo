<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { showPopup } from '@telegram-apps/sdk-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import {
  bem,
  AdvancedSettings30 as GeneralIcon,
  Users30 as ManagersIcon,
  StarsFill28 as PremiumSubIcon,
  Telegram24 as TelegramIcon,
  Surveys30 as TestGroupsIcon,
  PersonLineDottedFill28 as TransferIcon,
  Link30 as URLsIcon,
  EyeFillIOS28 as URLViewerIcon,
} from 'vue-ui';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import { isOwnerAppRole } from '@/roles/isOwnerAppRole';
import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyRightChevron from '@/ui/adapters/ListItemBodyRightChevron';
import ListItemLeftIcon from '@/ui/adapters/ListItemLeftIcon';
import Text from '@/ui/adapters/Text.vue';
import ListItemIcon from '@/ui/components/ListItemIcon.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import { createCustomListItemIcon } from '@/ui/helpers/createCustomListItemIcon';
import { setAppsViewQueryData } from '@/views/AppsView/query-options.js';

import AppIcon from './AppIcon.vue';
import {
  DeleteApp,
  ResetAppCache,
  type DeleteAppMutation,
  type DeleteAppMutationVariables,
  type ResetAppCacheMutation,
  type ResetAppCacheMutationVariables,
} from './operations';
import { setAppViewQueryData, useAppViewQueryOptions } from './query-options';

const TransferListItemIcon = createCustomListItemIcon(TransferIcon, 22, '#34C759');
const TelegramListItemIcon = createCustomListItemIcon(TelegramIcon, 24, '#007AFF');
const URLWizardListItemIcon = createCustomListItemIcon(URLViewerIcon, 24, '#FF2D55');
const PremiumSubListItemIcon = createCustomListItemIcon(PremiumSubIcon, 24, '#fc7922ff');
const [, e] = bem('app-view');

const { t } = useI18n({
  messages: {
    en: {
      general: 'General',
      managers: 'Managers',
      urls: 'URLs',
      premium: 'Premium subscription',
      testGroups: 'Test Groups',
      transfer: 'Transfer',
      urlViewer: 'URL Viewer',
      resetURLCache: 'Reset URL cache',
      resetURLCacheDescription: 'Resetting the cache will update the app URLs by appending a special query parameter, forcing Telegram clients to load the latest assets from your URLs.',
      cacheNotReset: 'The cache has never been reset.',
      cacheResetAt: 'The last time cache was reset at {date}',
      confirmCacheResetTitle: 'Confirm cache reset',
      confirmCacheResetMessage: 'Are you sure you want to reset the application cache?',
      confirmCacheResetCancel: 'Cancel',
      confirmCacheResetConfirm: 'Reset cache',
      confirmAppDeleteTitle: 'Confirm app deletion',
      confirmAppDeleteMessage: 'Are you sure you want to delete the application? This action is irreversible.',
      confirmAppDeleteCancel: 'Cancel',
      confirmAppDeleteConfirm: 'Delete app',
      deleteApp: 'Delete application',
    },
    ru: {
      general: 'Основная информация',
      managers: 'Менеджеры',
      urls: 'Ссылки',
      premium: 'Премиум-подписка',
      testGroups: 'Тестовые группы',
      transfer: 'Передача приложения',
      urlViewer: 'Обозреватель ссылок',
      resetURLCache: 'Сброс кеша',
      resetURLCacheDescription: 'Сброс кеша приведет к обновлению ссылок на приложение при помощи добавления специального query-параметра, вынуждающего клиент Telegram загрузить самое актуальное состояние по указанным ссылкам.',
      cacheNotReset: 'Кеш не сбрасывался.',
      cacheResetAt: 'Последний раз кеш был сброшен {date}',
      confirmCacheResetTitle: 'Подетвердите сброс кеша',
      confirmCacheResetMessage: 'Вы уверены, что хотите сбросить кеш приложения?',
      confirmCacheResetCancel: 'Отмена',
      confirmCacheResetConfirm: 'Сбсросить кеш',
      confirmAppDeleteTitle: 'Подтвердите удаление приложения',
      confirmAppDeleteMessage: 'Вы уверены, что хотите удалить приложение? Это действие необратимо.',
      confirmAppDeleteCancel: 'Отмена',
      confirmAppDeleteConfirm: 'Удалить приложение',
      deleteApp: 'Удалить приложение',
    },
  },
});
const router = useRouter();
const route = useRoute();
const appID = useAppIDFromParams();

const client = useQueryClient();
const { data } = useQuery(useAppViewQueryOptions(appID));
const { isPaused: isResettingCache, mutate: resetCache } = useMutation<
  ResetAppCacheMutation,
  unknown,
  ResetAppCacheMutationVariables
>({
  mutationFn: useMutationFn(ResetAppCache),
  onSuccess(response, vars) {
    setAppViewQueryData([vars.appID], client, data => {
      if (data && data.app) {
        data.app.urlsCacheResetAt = response.updateApp.urlsCacheResetAt;
        return data;
      }
    });
  },
});
const {
  isPending: isDeleting,
  mutate: deleteApp,
} = useMutation<DeleteAppMutation, unknown, DeleteAppMutationVariables>({
  mutationFn: useMutationFn(DeleteApp),
  onSuccess(_, vars) {
    setAppsViewQueryData(client, data => {
      if (data) {
        data.currentUser.apps = data.currentUser.apps.filter(item => item.app.id !== vars.appID);
        return data;
      }
    });
    router.go(-1);
  },
});
const isMutating = computed(() => isResettingCache.value || isDeleting.value);

const onResetCache = async () => {
  if (!isMutating.value && await showPopup({
    title: t('confirmCacheResetTitle'),
    message: t('confirmCacheResetMessage'),
    buttons: [
      { id: 'no', type: 'default', text: t('confirmCacheResetCancel') },
      { id: 'yes', type: 'default', text: t('confirmCacheResetConfirm') },
    ],
  }) === 'yes') {
    resetCache({ appID });
  }
};
const onDelete = async () => {
  if (!isMutating.value && await showPopup({
    title: t('confirmAppDeleteTitle'),
    message: t('confirmAppDeleteMessage'),
    buttons: [
      { id: 'no', type: 'default', text: t('confirmAppDeleteCancel') },
      {
        id: 'yes',
        type: 'destructive',
        text: t('confirmAppDeleteConfirm'),
      },
    ],
  }) === 'yes'
  ) {
    deleteApp({ appID });
  }
};
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data" />
      <template v-else>
        <AppIcon />
        <Text
          is="p"
          :class="e('title')"
          variant="title2"
          align="center"
          weight="bold"
        >
          {{ data.title }}
          <Text :class="e('title-id')">
            {{ ` · #${data.id}` }}
          </Text>
        </Text>
        <List
          v-for="(section, sectionIdx) in [
            [
              { icon: GeneralIcon, color: '#979797', title: t('general'), path: 'general' },
              { icon: ManagersIcon, color: '#ff9500', title: t('managers'), path: 'managers' },
              { icon: URLsIcon, color: '#007AFF', title: t('urls'), path: 'urls' },
              {
                icon: TestGroupsIcon,
                color: '#AF52DE',
                title: t('testGroups'),
                path: 'test-groups'
              },
            ],
            [{ icon: PremiumSubListItemIcon, title: t('premium'), path: 'premium' }],
            [{ icon: TelegramListItemIcon, title: 'Telegram', path: 'telegram' }],
            [{ icon: URLWizardListItemIcon, title: t('urlViewer'), path: 'url-viewer' }],
            [{ icon: TransferListItemIcon, title: t('transfer'), path: 'transfer' }],
          ]"
          :key="sectionIdx"
          :class="e('list')"
        >
          <ListItem
            v-for="(item, itemIdx) in section"
            :key="itemIdx"
            :clickable="!isMutating"
            @click="!isMutating && router.push(`${route.path}/${item.path}`)"
          >
            <template
              v-if="item.icon"
              #leftIcon
            >
              <ListItemLeftIcon rounded>
                <ListItemIcon
                  :is="item.icon"
                  :color="'color' in item ? item.color : undefined"
                />
              </ListItemLeftIcon>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ item.title }}
              </ListItemBodyLeftLabel>
            </template>
            <template #bodyRightChevron>
              <ListItemBodyRightChevron />
            </template>
          </ListItem>
        </List>

        <List
          v-if="isEditorAppRole(data.currentUserRole)"
          :class="e('list')"
        >
          <ListItem
            variant="accent"
            :clickable="!isMutating"
            @click="onResetCache"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ t('resetURLCache') }}
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
          <template #footer>
            {{ t('resetURLCacheDescription') + ' ' }}
            <template v-if="data.urlsCacheResetAt">
              {{ t('cacheResetAt', { date: new Date(data.urlsCacheResetAt).toLocaleString() }) }}
            </template>
            <template v-else>
              {{ t('cacheNotReset') }}
            </template>
          </template>
        </List>

        <List
          v-if="isOwnerAppRole(data.currentUserRole)"
          :class="e('list')"
        >
          <ListItem
            variant="destructive"
            :clickable="!isMutating"
            @click="onDelete"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ t('deleteApp') }}
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.app-view {
  &__title {
    margin-bottom: 16px;

    &-id {
      color: var(--theme-subtitle-text-color);
    }
  }

  &__list {
    margin: 8px 0;
  }
}
</style>
