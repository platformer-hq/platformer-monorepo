import * as fp from 'fp-ts';

import { AppTestGroupsPageDataDocument } from '../operations';

export function useAppTestGroupsPageQueryMeta() {
  return useQueryMeta(({ request }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppTestGroupsPageDataDocument, appId],
      query: throwify(() => {
        return fp.function.pipe(
          request(AppTestGroupsPageDataDocument, { appId }),
          fp.taskEither.map(({ app }) => (
            app
              ? {
                currentUserRole: apiAppRoleToLocal(app.currentUserRole),
                maxTestGroupsCount: app.limits.maxTestGroupsCount,
                testGroups: app.testGroups.map(group => ({
                  id: group.id,
                  title: group.title,
                  enabled: group.enabled,
                  usersCount: group.users.length,
                  platformsCount: group.platforms.length,
                })),
              }
              : null
          )),
        );
      }),
    }));
  });
}
