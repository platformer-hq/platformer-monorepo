import { useAppTestGroupPageStore, type AppTestGroupStoreStateUser } from '../_stores/useAppTestGroupPageStore';

export function useNavigateToAppTestGroupPage() {
  const store = useAppTestGroupPageStore();

  return (options: {
    appId: number;
    testGroupId?: number;
    enabled?: boolean;
    title?: string;
    url?: string;
    platformIds?: number[];
    users?: AppTestGroupStoreStateUser[];
  }) => {
    store.reset();
    store.setEnabled(options.enabled || false);
    store.setTitle(options.title || '');
    store.setUrl(options.url || '');
    store.setPlatformIds(options.platformIds || []);
    store.setUsers(options.users || []);
    navigateTo({
      name: PageNames.AppTestGroup,
      query: {
        appId: options.appId,
        testGroupId: options.testGroupId,
      },
    });
  };
}
