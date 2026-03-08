<script setup lang="ts">
import { skipToken, useQuery } from '@tanstack/vue-query';
import { refDebounced } from '@vueuse/core';
import * as fp from 'fp-ts';

import type { UserSelectionStoreSelectedUser } from '~/stores/useUserSelectionStore';

import { UserSelectionPageDataDocument } from './operations';

type QueryKey = [{
  document: typeof UserSelectionPageDataDocument;
  canAcceptAppTransfers?: boolean;
  canBeInvitedToManage?: boolean;
  excludedUserIds?: number[];
  input: string;
}];

const { t } = useI18n({
  messages: {
    en: {
      done: 'Done',
      'input.placeholder': 'Start typing to search users',
      'selectedUsers.title': 'Selected users',
      'foundUsers.title': 'Users found',
      'foundUsers.empty': 'No users found',
    },
    ru: {
      done: 'Готово',
      'input.placeholder': 'Начните ввод для поиска',
      'selectedUsers.title': 'Выбранные пользователи',
      'foundUsers.title': 'Найденные пользователи',
      'foundUsers.empty': 'Пользователи не найдены',
    },
  },
});
const { e } = bem('user-selection-page');

const store = useUserSelectionStore();
const platform = useTmaPlatform();
const router = useRouter();

const selectedUsers = ref<UserSelectionStoreSelectedUser[]>(store.selectedUsers || []);
const input = ref('');
const inputDebounced = refDebounced(input, 1000);

const excludedUserIds = computed(() => [
  ...store.excludedUserIds || [],
  ...selectedUsers.value.map(u => u.id),
]);

const request = useMakeGqlApiRequest();
const { data: foundUsers, isPending: isSearchingUsers } = useQuery({
  staleTime: 0,
  queryKey: computed(() => [{
    document: UserSelectionPageDataDocument,
    canAcceptAppTransfers: store.canAcceptAppTransfers,
    canBeInvitedToManage: store.canBeInvitedToManage,
    excludedUserIds: excludedUserIds.value,
    input: inputDebounced.value,
  }] satisfies QueryKey),
  queryFn: computed(() => {
    return !inputDebounced.value
      ? skipToken
      : throwify(({ queryKey: [options] }: { queryKey: QueryKey }) => {
        return fp.function.pipe(
          request(options.document, {
            canReceiveAppTransferReq: options.canAcceptAppTransfers,
            canReceiveManagementInvite: options.canBeInvitedToManage,
            input: options.input,
            page: 0,
            excludeUserIDs: options.excludedUserIds,
          }),
          fp.taskEither.map(r => r.searchUsers),
        );
      });
  }),
});
const lastFoundUsers = ref(foundUsers.value || []);
const displayedFoundUsers = computed(() => {
  return lastFoundUsers
    .value
    .filter(u => selectedUsers.value.every(u2 => u.id !== u2.id));
});
const isSearching = computed(() => (
  input.value !== inputDebounced.value || isSearchingUsers.value
));

watch(foundUsers, users => {
  if (users) {
    lastFoundUsers.value = users;
  }
});

const userTransition = createReversibleTransition({
  animatedProperties({ transition, el }) {
    return reverseTransitionKeyframesIfLeave({
      overflow: ['hidden', 'hidden'],
      height: ['0px', el.clientHeight + 'px'],
      opacity: [0, 1],
    }, transition);
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
  },
});
const indicatorTransition = createReversibleTransition({
  animatedProperties: {
    opacity: [0, 1],
    transform: ['scale(0.8)', 'scale(1.2)', 'scale(1)'],
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
  },
});

const selectUser = (user: { id: number; name: string }) => {
  hapticSelectionChanged();
  if (store.autoConfirmOnLimit && store.limit === selectedUsers.value.length + 1) {
    store.setSelectedUsers([...selectedUsers.value, user]);
    router.back();
    return;
  }
  selectedUsers.value.push(user);
};
const removeUser = (idx: number) => {
  hapticSelectionChanged();
  selectedUsers.value.splice(idx, 1);
};
</script>

<template>
  <PageBase>
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="secondary-bg">
          <AutoList>
            <AutoListItem>
              <template #left>
                <AutoListItemLeft size="small">
                  <AutoListItemLeftIcon>
                    <AutoListItemLeftIconElement :style="{color: colorReference('subtitle-text')}">
                      <Transition v-bind="indicatorTransition" :css="false" mode="out-in">
                        <AutoLoadingIndicator v-if="isSearching && input" :size="20"/>
                        <IconMagnify24 v-else/>
                      </Transition>
                    </AutoListItemLeftIconElement>
                  </AutoListItemLeftIcon>
                </AutoListItemLeft>
              </template>
              <template #bodyLeftInput>
                <AutoListItemBodyLeftInput>
                  <AutoListItemBodyLeftInputElement
                    v-model.trim="input"
                    :placeholder="t('input.placeholder')"
                  />
                </AutoListItemBodyLeftInput>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>

        <AutoSection
          v-if="selectedUsers.length"
          list-bg-color="secondary-bg"
          :class="e('users')"
        >
          <template #header>
            <AutoSectionHeader>
              {{ t('selectedUsers.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <TransitionGroup :css="false" v-bind="userTransition" appear>
              <AutoListItem v-for="(user, idx) in selectedUsers" :key="user.id">
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ user.name }} <span :class="e('user-id')">#{{ user.id }}</span>
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoButton
                      :class="e('remove-user')"
                      :palette="{text: 'subtitle-text'}"
                      :active="platform.isMappedAndroid"
                      clickable
                      @click="removeUser(idx)"
                    >
                      <IconXmark24 v-if="platform.isMappedAndroid"/>
                      <IconXmarkFill28 v-else :size="24"/>
                    </AutoButton>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </TransitionGroup>
          </AutoList>
        </AutoSection>

        <AutoSection
          v-if="displayedFoundUsers?.length || (input && !isSearching)"
          list-bg-color="secondary-bg"
          :class="e('users')"
        >
          <template #header>
            <AutoSectionHeader>
              {{ t('foundUsers.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <TransitionGroup :css="false" v-bind="userTransition" appear>
              <AutoListItem v-if="!displayedFoundUsers?.length" key="not-found">
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ t('foundUsers.empty') }}
                  </AutoListItemBodyLeftLabel>
                </template>
              </AutoListItem>
              <AutoListItem
                v-for="user in displayedFoundUsers"
                v-else
                :key="user.id"
                clickable
                @click="selectUser(user)"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ user.name }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoListItemBodyRightLabel :class="e('user-id')">
                      #{{ user.id }}
                    </AutoListItemBodyRightLabel>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </TransitionGroup>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageBase>
</template>

<style lang="scss">
.user-selection-page {
  &__loading-indicator {
    margin: 16px auto 0;
  }

  &__users {
    margin-top: 16px;
  }

  &__user-id {
    color: var(--subtitle-text-color);
  }

  &__remove-user {
    min-height: 0;
    padding: 6px;
    border-radius: 50%;
  }
}
</style>
