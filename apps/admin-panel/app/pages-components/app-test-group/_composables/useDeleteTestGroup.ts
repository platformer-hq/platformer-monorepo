import { DeleteTestGroupDocument } from '../operations';

export function useDeleteTestGroup(appId: number) {
  const request = useMakeApiGqlRequest();
  const { setData: setAppTestGroupsPageQueryData } = useAppTestGroupsPageQueryMeta();
  const router = useRouter();

  return useMutation({
    key: [DeleteTestGroupDocument],
    mutation(options: { testGroupId: number }) {
      return throwifyAnyEither(
        request(DeleteTestGroupDocument, { testGroupId: options.testGroupId }),
      );
    },
    onSuccess(_, { testGroupId }) {
      hapticNotificationOccurred('success');
      setAppTestGroupsPageQueryData(appId, prev => (
        prev
          ? { ...prev, testGroups: prev.testGroups.filter(t => t.id !== testGroupId) }
          : prev
      ));
      router.back();
    },
    onError() {
      hapticNotificationOccurred('error');
    },
  });
}
