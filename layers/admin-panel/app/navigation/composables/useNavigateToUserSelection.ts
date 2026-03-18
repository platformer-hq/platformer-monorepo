import type { UserSelectionStoreSelectedUser, UserSelectionStoreOnConfirmAction } from '~/stores/useUserSelectionStore';

export function useNavigateToUserSelection() {
  const store = useUserSelectionStore();

  return (options: {
    autoConfirmOnLimit?: boolean;
    alwaysShowConfirm?: boolean;
    canBeInvitedToManage?: boolean;
    canAcceptAppTransfers?: boolean;
    excludedUserIds?: number[];
    limit?: number;
    onConfirmAction?: UserSelectionStoreOnConfirmAction;
    requestedBy?: PageNames;
    selectedUsers?: UserSelectionStoreSelectedUser[];
  } = {}) => {
    store.reset();
    store.setAlwaysShowConfirm(options.alwaysShowConfirm);
    store.setLimit(options.limit);
    store.setAutoConfirmOnLimit(options.autoConfirmOnLimit);
    store.setCanAcceptAppTransfers(options.canAcceptAppTransfers);
    store.setCanBeInvitedToManage(options.canBeInvitedToManage);
    store.setExcludedUserIds(options.excludedUserIds);
    store.setSelectedUsers(options.selectedUsers);
    store.setOnConfirmAction(options.onConfirmAction);
    store.setRequestedBy(options.requestedBy);
    navigateTo({ name: PageNames.UserSelection });
  };
}
