import * as fp from 'fp-ts';

import { AppTestGroupPageDataDocument } from '../operations';

export function useAppTestGroupPageQueryMeta() {
  return useQueryMeta(({ request }) => {
    return defineQueryOptions((options: {
      appId: number;
      testGroupId?: number;
    }) => ({
      key: [AppTestGroupPageDataDocument, options.appId, options.testGroupId || 0],
      query: throwify(() => {
        return fp.function.pipe(
          request(AppTestGroupPageDataDocument, {
            appId: options.appId,
            testGroupId: options.testGroupId || 0,
            skipTestGroup: options.testGroupId === undefined,
          }),
          fp.taskEither.map(({ app, appTestGroup, platforms }) => ({
            maxTestGroupsCount: app?.limits.maxTestGroupUsersCount,
            app: app
              ? {
                currentUserRole: apiAppRoleToLocal(app.currentUserRole),
              }
              : null,
            testGroup: appTestGroup
              ? {
                id: appTestGroup.id,
                title: appTestGroup.title,
                url: appTestGroup.url,
                enabled: appTestGroup.enabled,
                platformIds: appTestGroup.platforms.map(item => item.id),
                users: appTestGroup.users.map(u => ({ id: u.id, name: u.name })),
              }
              : null,
            platforms: platforms.map(p => ({ id: p.id, title: p.completeTitle })),
          })),
        );
      }),
    }));
  });
}
