import * as fp from 'fp-ts';

import { CreateTestGroupDocument } from '../operations';

export function useCreateTestGroup() {
  const request = useMakeApiGqlRequest();
  const {
    setData: setAppTestGroupPageQueryData,
    getData: getAppTestGroupPageQueryData,
  } = useAppTestGroupPageQueryMeta();
  const { setData: setAppTestGroupsPageQueryData } = useAppTestGroupsPageQueryMeta();
  const router = useRouter();

  return useMutation({
    key: [CreateTestGroupDocument],
    mutation(options: {
      appId: number;
      title: string;
      enabled: boolean;
      url: string;
      platformIds: number[];
      userIds: number[];
    }) {
      return throwifyAnyEither(
        fp.function.pipe(
          request(CreateTestGroupDocument, {
            enabled: options.enabled,
            platformIds: options.platformIds,
            appId: options.appId,
            title: options.title,
            url: options.url,
            userIds: options.userIds,
          }),
          fp.taskEither.map(r => r.createAppTestGroup),
        ),
      );
    },
    onSuccess({ enabled, id, platforms, title, url, users }, { appId }) {
      hapticNotificationOccurred('success');

      // Update test groups page data.
      setAppTestGroupsPageQueryData(appId, prev => (
        prev
          ? {
            ...prev,
            testGroups: [...prev.testGroups, {
              enabled,
              id,
              platformsCount: platforms.length,
              title,
              usersCount: users.length,
            }],
          }
          : prev
      ));

      // Update created test group page data.
      const nonTestGroupData = getAppTestGroupPageQueryData({ appId });
      if (nonTestGroupData) {
        setAppTestGroupPageQueryData({ appId, testGroupId: id }, {
          ...nonTestGroupData,
          testGroup: {
            enabled,
            id,
            platformIds: platforms.map(platform => platform.id),
            title,
            url,
            users,
          },
        });
      }
      router.back();
    },
    onError() {
      hapticNotificationOccurred('error');
    },
  });
}
