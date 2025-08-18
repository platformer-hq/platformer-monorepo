<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { AppUrlSimpleExplanationKind } from 'schema';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem, Telegram24 } from 'vue-ui';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeft from '@/ui/adapters/ListItemBodyLeft';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightClear from '@/ui/adapters/ListItemBodyRightClear';
import ListItemLeftIcon from '@/ui/adapters/ListItemLeftIcon';
import ListItemIcon from '@/ui/components/ListItemIcon.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import type { SelectedUser } from '@/ui/components/UserSelectionView/UserSelectionView.vue';
import UserSelectionView from '@/ui/components/UserSelectionView/UserSelectionView.vue';
import { createCustomListItemIcon } from '@/ui/helpers/createCustomListItemIcon';

import { useAppUrlViewerViewQueryOptions } from './query-options';

const TelegramListItemIcon = createCustomListItemIcon(Telegram24, 24, '#007AFF');

const { t } = useI18n({
  messages: {
    en: {
      title: 'URL Viewer',
      footer: 'The URL viewer lets you select a user and displays which URLs will be chosen for them on each platform. It also provides an explanation for why a specific URL was selected.',
      selectUser: 'Select user',
      selectAnotherUser: 'Select another user',
      selectedUser: 'Selected user',
      noURL: 'No URL to display',
      expAccessNotAllowed: 'User is not a manager and the application is private',
      expAppIsPublic: 'Application is public and accessible to everybody by this URL. A public URL is used',
      expUserIsManager: 'Application is private, but the user is its manager. A public URL is used',
      expTestGroup: 'The user belongs to the active test group {testGroup}. The test group URL is used',
    },
    ru: {
      title: 'Обозреватель ссылок',
      footer: 'Обозреватель ссылок позволяет Вам выбрать пользователя и узнать, какие ссылки будут подобраны под него на каждой платформе. Он также предоставляет пояснение о том, почему именно эта ссылка была выбрана.',
      selectUser: 'Выбрать пользователя',
      selectAnotherUser: 'Выбрать другого пользователя',
      selectedUser: 'Выбранный пользователь',
      noURL: 'Нет ссылки для отображения',
      expAccessNotAllowed: 'Приложение приватно и пользователь не является его менеджером',
      expAppIsPublic: 'Приложение публично и доступному всем по указанной ссылке. Использована общедоступная ссылка',
      expUserIsManager: 'Приложение приватно, но пользователь является его менеджером. Использована общедоступная ссылка',
      expTestGroup: 'Пользователь является участником активной тестовой группы {testGroup}. Используется ссылка этой тестовой группы',
    },
  },
});
const selectedUser = ref<SelectedUser>();
const isSelectingUser = ref(false);
const dropIsSelectingUser = () => {
  isSelectingUser.value = false;
};
const dropSelectedUser = () => {
  selectedUser.value = undefined;
};
const { data } = useQuery({
  ...useAppUrlViewerViewQueryOptions(useAppIDFromParams(), computed(() => selectedUser.value?.id)),
  staleTime: 0,
});
const [, e] = bem('app-url-viewer-view');
</script>

<template>
  <UserSelectionView
    v-if="isSelectingUser"
    @back="dropIsSelectingUser"
    @user-selected="
      dropIsSelectingUser();
      selectedUser = $event
    "
  />

  <Page
    v-else-if="selectedUser"
    @back="dropSelectedUser"
  >
    <PagePaddings>
      <List :title="t('selectedUser')">
        <ListItem>
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ selectedUser.name }}&nbsp;
              <span :class="e('user-id')">#{{ selectedUser.id }}</span>
            </ListItemBodyLeftLabel>
          </template>
          <template #bodyRightClear>
            <ListItemBodyRightClear @click="dropSelectedUser" />
          </template>
        </ListItem>
        <ListItem
          clickable
          variant="accent"
          @click="isSelectingUser = true"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ t('selectAnotherUser') }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
      </List>
      <PageLoading v-if="!data" />
      <List
        v-for="item in data"
        v-else
        :key="item.platform.completeTitle"
        :class="e('item')"
      >
        <ListItem>
          <template #leftIcon>
            <ListItemLeftIcon rounded>
              <ListItemIcon
                :is="TelegramListItemIcon"
                color="white"
              />
            </ListItemLeftIcon>
          </template>
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel medium>
              {{ item.platform.completeTitle }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
        <ListItem
          :variant="item.url ? undefined : 'placeholder'"
          :class="e('url')"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel :class="e('url-text')">
              {{ item.url || t('noURL') }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
        <ListItem
          :class="e('exp')"
          variant="placeholder"
        >
          <template #bodyLeft>
            <ListItemBodyLeft :class="e('exp-body')">
              <template #label>
                <ListItemBodyLeftLabel :class="e('exp-text')">
                  {{ 'kind' in item.explanation
                    ? t({
                      [AppUrlSimpleExplanationKind.AccessNotAllowed]: 'expAccessNotAllowed',
                      [AppUrlSimpleExplanationKind.AppIsPublic]: 'expAppIsPublic',
                      [AppUrlSimpleExplanationKind.UserIsManager]: 'expUserIsManager',
                    }[item.explanation.kind])
                    : 'id' in item.explanation
                      ? t('expTestGroup', {
                        testGroup: item.explanation.title
                          ? `"${item.explanation.title}"`
                          : `#${item.explanation.id}`
                      })
                      : undefined }}
                </ListItemBodyLeftLabel>
              </template>
            </ListItemBodyLeft>
          </template>
        </ListItem>
      </List>
    </PagePaddings>
  </Page>

  <Page v-else>
    <PagePaddings>
      <List
        :title="t('title')"
        :footer="t('footer')"
      >
        <ListItem
          clickable
          variant="accent"
          @click="isSelectingUser = true"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ t('selectUser') }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
      </List>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.app-url-viewer-view {
  &__user-id {
    color: var(--theme-subtitle-text-color);
  }

  &__item {
    margin-top: 12px;
  }

  &__no-url {
    color: var(--theme-subtitle-text-color);
  }

  &__url {
    height: auto;
    padding: 11px 0;

    &-text {
      white-space: normal;
      word-wrap: break-word;
    }
  }

  &__exp {
    height: auto;

    &-body {
      padding: 11px 0;
    }

    &-text {
      white-space: unset;
    }
  }
}
</style>
