import type { UserSelectionStoreSelectedUser, UserSelectionStoreOnConfirmAction } from '~/stores/useUserSelectionStore';

export function useNavigateToUserSelection() {
  const store = useUserSelectionStore();

  return (options: {
    limit?: number;
    excludedUserIds?: number[];
    selectedUsers?: UserSelectionStoreSelectedUser[];
    autoConfirmOnLimit?: boolean;
    onConfirmAction?: UserSelectionStoreOnConfirmAction;
    canBeInvitedToManage?: boolean;
    canAcceptAppTransfers?: boolean;
  } = {}) => {
    store.reset();
    store.setLimit(options.limit);
    store.setAutoConfirmOnLimit(options.autoConfirmOnLimit);
    store.setCanAcceptAppTransfers(options.canAcceptAppTransfers);
    store.setCanBeInvitedToManage(options.canBeInvitedToManage);
    store.setExcludedUserIds(options.excludedUserIds);
    store.setSelectedUsers(options.selectedUsers);
    store.setOnConfirmAction(options.onConfirmAction);
    navigateTo({ name: PageNames.UserSelection });
  };
}
