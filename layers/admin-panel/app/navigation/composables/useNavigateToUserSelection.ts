import type { UserSelectionStoreSelectedUser } from '~/stores/useUserSelectionStore';

export function useNavigateToUserSelection() {
  const store = useUserSelectionStore();

  return (options: {
    limit?: number;
    excludedUserIds?: number[];
    selectedUsers?: UserSelectionStoreSelectedUser[];
    autoConfirmOnLimit?: boolean;
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
    navigateTo({ name: PAGE_NAME_USER_SELECTION });
  };
}
