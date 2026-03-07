import { useSessionStorage } from '@vueuse/core';
import * as v from 'valibot';

export interface UserSelectionStoreSelectedUser {
  id: number;
  name: string;
}

interface State {
  limit?: number;
  excludedUserIds?: number[];
  selectedUsers?: UserSelectionStoreSelectedUser[];
  autoConfirmOnLimit?: boolean;
  canBeInvitedToManage?: boolean;
  canAcceptAppTransfers?: boolean;
}

export const useUserSelectionStore = defineStore('user-selection', () => {
  const defaultState = {};
  const state = useSessionStorage<State>('selected-users', defaultState, {
    serializer: {
      read(value) {
        return v.parse(
          v.pipe(
            v.string(),
            v.parseJson(),
            v.looseObject({
              limit: v.optional(v.number()),
              excludedUserIds: v.optional(v.array(v.number())),
              selectedUsers: v.optional(v.array(v.looseObject({
                id: v.number(),
                name: v.string(),
              }))),
              autoConfirmOnLimit: v.optional(v.boolean()),
              canBeInvitedToManage: v.optional(v.boolean()),
              canAcceptAppTransfers: v.optional(v.boolean()),
            }),
          ),
          value,
        );
      },
      write: JSON.stringify,
    },
  });

  return {
    limit: computed(() => state.value.limit),
    setLimit(value: number | undefined) {
      state.value.limit = value;
    },
    excludedUserIds: computed(() => state.value.excludedUserIds),
    setExcludedUserIds(value: number[] | undefined) {
      state.value.excludedUserIds = value ? [...value] : undefined;
    },
    selectedUsers: computed(() => state.value.selectedUsers),
    setSelectedUsers(value: UserSelectionStoreSelectedUser[] | undefined) {
      state.value.selectedUsers = value ? [...value] : undefined;
    },
    autoConfirmOnLimit: computed(() => state.value.autoConfirmOnLimit),
    setAutoConfirmOnLimit(value: boolean | undefined) {
      state.value.autoConfirmOnLimit = value;
    },
    canBeInvitedToManage: computed(() => state.value.canBeInvitedToManage),
    setCanBeInvitedToManage(value: boolean | undefined) {
      state.value.canBeInvitedToManage = value;
    },
    canAcceptAppTransfers: computed(() => state.value.canBeInvitedToManage),
    setCanAcceptAppTransfers(value: boolean | undefined) {
      state.value.canAcceptAppTransfers = value;
    },
    reset() {
      state.value = defaultState;
    },
  };
});
