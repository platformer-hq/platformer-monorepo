import { useSessionStorage } from '@vueuse/core';
import * as v from 'valibot';

export interface UserSelectionStoreSelectedUser {
  id: number;
  name: string;
}

export type UserSelectionStoreOnConfirmAction = (
  {
    kind: 'navigate-to';
    replace?: boolean;
  } & ({
    page: PageNames.AppManagerInvite;
    query: {
      appId: number;
    };
  } | {
    page: Exclude<PageNames, PageNames.AppManagerInvite>;
  })
);

interface State {
  requestedBy?: PageNames;
  limit?: number;
  excludedUserIds?: number[];
  selectedUsers?: UserSelectionStoreSelectedUser[];
  autoConfirmOnLimit?: boolean;
  alwaysShowConfirm?: boolean;
  onConfirmAction?: UserSelectionStoreOnConfirmAction;
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
              alwaysShowConfirm: v.optional(v.boolean()),
              autoConfirmOnLimit: v.optional(v.boolean()),
              canBeInvitedToManage: v.optional(v.boolean()),
              canAcceptAppTransfers: v.optional(v.boolean()),
              excludedUserIds: v.optional(v.array(v.number())),
              limit: v.optional(v.number()),
              onConfirmAction: v.optional(v.variant('kind', [
                v.variant('page', [
                  v.looseObject({
                    kind: v.literal('navigate-to'),
                    page: v.literal(PageNames.AppManagerInvite),
                    replace: v.optional(v.boolean()),
                    query: v.looseObject({
                      appId: v.number(),
                    }),
                  }),
                ]),
              ])),
              requestedBy: v.optional(v.enum(PageNames)),
              selectedUsers: v.optional(v.array(v.looseObject({
                id: v.number(),
                name: v.string(),
              }))),
            }),
          ),
          value,
        );
      },
      write: JSON.stringify,
    },
  });

  return {
    alwaysShowConfirm: computed(() => state.value.alwaysShowConfirm),
    setAlwaysShowConfirm(value: boolean | undefined) {
      state.value.alwaysShowConfirm = value;
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
    excludedUserIds: computed(() => state.value.excludedUserIds),
    setExcludedUserIds(value: number[] | undefined) {
      state.value.excludedUserIds = value ? [...value] : undefined;
    },
    limit: computed(() => state.value.limit),
    setLimit(value: number | undefined) {
      state.value.limit = value;
    },
    onConfirmAction: computed(() => state.value.onConfirmAction),
    setOnConfirmAction(value: UserSelectionStoreOnConfirmAction | undefined) {
      state.value.onConfirmAction = value;
    },
    requestedBy: computed(() => state.value.requestedBy),
    setRequestedBy(value: PageNames | undefined) {
      state.value.requestedBy = value;
    },
    selectedUsers: computed(() => state.value.selectedUsers),
    setSelectedUsers(value: UserSelectionStoreSelectedUser[] | undefined) {
      state.value.selectedUsers = value ? [...value] : undefined;
    },
    reset() {
      state.value = defaultState;
    },
  };
});
