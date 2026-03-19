import type { UserSelectionStoreState } from '~/stores/useUserSelectionStore';

export function useNavigateToUserSelection() {
  const store = useUserSelectionStore();

  return (options: Partial<UserSelectionStoreState> = {}) => {
    store.reset();
    store.setAutoConfirmOnLimit(options.autoConfirmOnLimit);
    store.setAlwaysShowConfirm(options.alwaysShowConfirm);
    store.setCanAcceptAppTransfers(options.canAcceptAppTransfers);
    store.setCanBeInvitedToManage(options.canBeInvitedToManage);
    store.setExcludedUserIds(options.excludedUserIds);
    store.setLimit(options.limit);
    store.setNavId(options.navId);
    store.setOnConfirmAction(options.onConfirmAction);
    store.setSelectedUsers(options.selectedUsers);
    navigateTo({ name: PageNames.UserSelection });
  };
}
