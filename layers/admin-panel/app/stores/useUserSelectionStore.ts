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

export interface UserSelectionStoreState {
  /**
   * Auto confirms whenever the selection limit is reached.
   */
  autoConfirmOnLimit?: boolean;
  /**
   * Always shows the confirmation button.
   */
  alwaysShowConfirm?: boolean;
  /**
   * True of only users available to receive apps can be selected.
   */
  canAcceptAppTransfers?: boolean;
  /**
   * True of only users available to manage apps can be selected.
   */
  canBeInvitedToManage?: boolean;
  /**
   * A list of users to exclude.
   */
  excludedUserIds?: number[];
  /**
   * How many users can be selected.
  */
  limit?: number;
  /**
   * A unique identifier for the current selection. This one can be used by other pages in order
   * to deremine if the current store state may be used by the page.
   */
  navId?: number;
  /**
   * Action to perform whenever the confirm button is pressed.
   */
  onConfirmAction?: UserSelectionStoreOnConfirmAction;
  /**
   * A list of selected users.
   */
  selectedUsers?: UserSelectionStoreSelectedUser[];
}

export const useUserSelectionStore = defineStore('user-selection', () => {
  const defaultState = {};
  const state = useSessionStorage<UserSelectionStoreState>('selected-users', defaultState, {
    serializer: {
      read(value) {
        return v.parse(
          v.pipe(
            v.string(),
            v.parseJson(),
            v.looseObject({
              autoConfirmOnLimit: v.optional(v.boolean()),
              alwaysShowConfirm: v.optional(v.boolean()),
              canAcceptAppTransfers: v.optional(v.boolean()),
              canBeInvitedToManage: v.optional(v.boolean()),
              excludedUserIds: v.optional(v.array(v.number())),
              limit: v.optional(v.number()),
              navId: v.optional(v.number()),
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
    autoConfirmOnLimit: computed(() => state.value.autoConfirmOnLimit),
    setAutoConfirmOnLimit(value: boolean | undefined) {
      state.value.autoConfirmOnLimit = value;
    },
    alwaysShowConfirm: computed(() => state.value.alwaysShowConfirm),
    setAlwaysShowConfirm(value: boolean | undefined) {
      state.value.alwaysShowConfirm = value;
    },
    canAcceptAppTransfers: computed(() => state.value.canBeInvitedToManage),
    setCanAcceptAppTransfers(value: boolean | undefined) {
      state.value.canAcceptAppTransfers = value;
    },
    canBeInvitedToManage: computed(() => state.value.canBeInvitedToManage),
    setCanBeInvitedToManage(value: boolean | undefined) {
      state.value.canBeInvitedToManage = value;
    },
    excludedUserIds: computed(() => state.value.excludedUserIds),
    setExcludedUserIds(value: number[] | undefined) {
      state.value.excludedUserIds = value ? [...value] : undefined;
    },
    limit: computed(() => state.value.limit),
    setLimit(value: number | undefined) {
      state.value.limit = value;
    },
    navId: computed(() => state.value.navId),
    setNavId(value: number | undefined) {
      state.value.navId = value;
    },
    onConfirmAction: computed(() => state.value.onConfirmAction),
    setOnConfirmAction(value: UserSelectionStoreOnConfirmAction | undefined) {
      state.value.onConfirmAction = value;
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
