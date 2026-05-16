import * as fp from 'fp-ts';

import { UpdateTestGroupDocument } from '../operations';

export function useUpdateTestGroup(appId: number) {
  const request = useMakeApiGqlRequest();
  const { setData: setAppTestGroupPageQueryData } = useAppTestGroupPageQueryMeta();
  const { setData: setAppTestGroupsPageQueryData } = useAppTestGroupsPageQueryMeta();

  return useMutation({
    key: [UpdateTestGroupDocument],
    mutation(options: {
      testGroupId: number;
      title: string;
      enabled: boolean;
      url: string;
      platformIds: number[];
      userIds: number[];
    }) {
      return throwifyAnyEither(
        fp.function.pipe(
          request(UpdateTestGroupDocument, {
            enabled: options.enabled,
            platformIds: options.platformIds,
            testGroupId: options.testGroupId,
            title: options.title,
            url: options.url,
            userIds: options.userIds,
          }),
          fp.taskEither.map(r => r.updateAppTestGroup),
        ),
      );
    },
    onSuccess({ enabled, id, platforms, title, url, users }) {
      hapticNotificationOccurred('success');

      // Update test groups page data.
      setAppTestGroupsPageQueryData(appId, prev => (
        prev
          ? {
            ...prev,
            testGroups: prev.testGroups.map(t => (
              t.id === id
                ? {
                  ...t,
                  enabled,
                  platformsCount: platforms.length,
                  title,
                  usersCount: users.length,
                  url,
                }
                : t
            )),
          }
          : prev
      ));

      // Update existing test group page data.
      setAppTestGroupPageQueryData({ appId, testGroupId: id }, prev => ({
        ...prev,
        testGroup: { id, enabled, platformIds: platforms.map(p => p.id), title, users, url },
      }));
    },
    onError() {
      hapticNotificationOccurred('error');
    },
  });
}
