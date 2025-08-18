<script setup lang="ts">
import { skipToken, useQuery, type QueryFunction, type SkipToken } from '@tanstack/vue-query';
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { refDebounced } from '@vueuse/core';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem } from 'vue-ui';

import { useGqlRequest } from '@/queries/useGqlRequest';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightClear from '@/ui/adapters/ListItemBodyRightClear';
import ListItemBodyRightLabel from '@/ui/adapters/ListItemBodyRightLabel';
import SearchField from '@/ui/adapters/SearchField';
import Text from '@/ui/adapters/Text.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

import { SearchUsers, type SearchUsersQuery } from './operations';

export interface SelectedUser {
  id: number;
  name: string;
}

type SearchFor = 'management' | 'app-transfer';

const {
  selectedUsers = [],
  searchFor,
  excludedUserIds = [],
  onDone,
} = defineProps<{
  /**
   * A list of users to exclude from the search.
   */
  excludedUserIds?: number[];
  /**
   * Search mode. Determines which search exactly will be performed.
   */
  searchFor?: SearchFor;
  /**
   * List of selected users to display.
   */
  selectedUsers?: SelectedUser[];
  onDone?(): void;
  onUserDeleted?(user: SelectedUser): void;
}>();
defineEmits<{
  /**
   * A callback that is called whenever the user presses the Back Button.
   */
  back: [];
  /**
   * A callback that is called whenever the selection is done.
   */
  done: [];
  /**
   * A callback that is called whenever the user is deleted.
   */
  userDeleted: [user: SelectedUser];
  /**
   * A callback that is called whenever the user is selected.
   */
  userSelected: [user: SelectedUser];
}>();

const [, e] = bem('user-selection-view');

const { t } = useI18n({
  messages: {
    en: {
      done: 'Done',
      search: 'Search',
      selectedUsers: 'Selected users',
      hint: 'Start typing to search users',
      nothingFound: 'No users found',
      foundUsers: 'Users found',
      foundUsersCount: '{count} users | {count} user | {count} users',
    },
    ru: {
      done: 'Готово',
      search: 'Поиск',
      selectedUsers: 'Выбранные пользователи',
      hint: 'Начните ввод для поиска',
      nothingFound: 'Пользователи не найдены',
      foundUsers: 'Найденные пользователи',
      foundUsersCount: '{count} пользователей | {count} пользователь | {count} пользователя | {count} пользователей',
    },
  },
});
const search = ref('');
const searchDebounced = refDebounced(search, 2000);
const request = useGqlRequest();
const queryFn = computed<
  | QueryFunction<
    SearchUsersQuery,
    readonly ['user-selection-view', SearchFor | undefined, number[], string]
  >
  | SkipToken
>(() => {
  return !searchDebounced.value
    ? skipToken
    : ({ signal, queryKey: [, searchFor, excludedUserIds, input] }) => {
      return request(
        SearchUsers,
        {
          input,
          page: 0,
          excludeUserIDs: excludedUserIds,
          canReceiveAppTransferReq: searchFor === 'app-transfer',
          canReceiveManagementInvite: searchFor === 'management',
        },
        signal,
      );
    };
});
const { data: foundUsers, isPending: isSearchingUsers } = useQuery({
  queryKey: ['user-selection-view', searchFor, excludedUserIds, searchDebounced] as const,
  queryFn,
  staleTime: 0,
  select: r => r.searchUsers,
});
const isSearching = computed(() => {
  return search.value !== searchDebounced.value || isSearchingUsers.value;
});
const displayedFoundUsers = computed(() => {
  return foundUsers.value
    ? foundUsers.value.filter(u => !excludedUserIds.includes(u.id))
    : undefined;
});

watchEffect(() => {
  if (onDone) {
    setMainButtonParams({
      isVisible: true,
      isLoaderVisible: false,
      isEnabled: true,
      text: t('done'),
    });
    onWatcherCleanup(onMainButtonClick(onDone));
  }
});
</script>

<template>
  <Page
    :preserve-main-button="!!onDone"
    @back="$emit('back')"
  >
    <PagePaddings>
      <SearchField
        v-model:value="search"
        :placeholder="t('search')"
      />
      <List
        v-if="selectedUsers.length"
        :class="e('list')"
        :title="t('selectedUsers')"
      >
        <ListItem
          v-for="user in selectedUsers"
          :key="user.id"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ user.name + ' ' }}
              <span :class="e('user-id')">
                #{{ user.id }}
              </span>
            </ListItemBodyLeftLabel>
          </template>
          <template
            v-if="onUserDeleted"
            #bodyRightClear
          >
            <ListItemBodyRightClear @click="$emit('userDeleted', user)" />
          </template>
        </ListItem>
      </List>

      <Text
        is="p"
        v-if="!search"
        :class="e('search-hint')"
        align="center"
        variant="footnote"
      >
        {{ t('hint') }}
      </Text>
      <PageLoading v-else-if="isSearching" />
      <template v-else-if="displayedFoundUsers">
        <Text
          is="p"
          v-if="!displayedFoundUsers.length"
          :class="e('search-hint')"
          align="center"
          variant="footnote"
        >
          {{ t('nothingFound') }}
        </Text>
        <List
          v-else
          :class="e('list')"
          :title="t('foundUsers')"
        >
          <ListItem
            v-for="user in displayedFoundUsers"
            :key="user.id"
            clickable
            @click="$emit('userSelected', user)"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ user.name }}
              </ListItemBodyLeftLabel>
            </template>
            <template #bodyRightLabel>
              <ListItemBodyRightLabel>
                #{{ user.id }}
              </ListItemBodyRightLabel>
            </template>
          </ListItem>
          <template #footer>
            {{ t('foundUsersCount', { count: displayedFoundUsers.length }) }}
          </template>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.user-selection-view {
  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__list {
    margin-top: 16px;
  }

  &__search-hint {
    padding: 8px 16px;
    color: var(--theme-subtitle-text-color);
  }

  &__user-id {
    color: var(--theme-subtitle-text-color);
  }
}
</style>
