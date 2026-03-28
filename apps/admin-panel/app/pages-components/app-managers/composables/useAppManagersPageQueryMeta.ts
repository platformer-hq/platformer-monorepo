import * as fp from 'fp-ts';

import { AppManagersPageDataDocument } from '../operations';

export function useAppManagersPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppManagersPageDataDocument, appId],
      query: throwify(() => {
        return fp.function.pipe(
          apiGqlRequest(AppManagersPageDataDocument, { appId }),
          fp.taskEither.map(({ app, currentUser }) => (
            app
              ? {
                currentUser: {
                  id: currentUser.id,
                  role: apiAppRoleToLocal(app.currentUserRole),
                },
                invites: app.managementInvites.map(invite => ({
                  id: invite.id,
                  from: invite.from.name,
                  role: apiAppManagementInviteRoleToLocal(invite.role),
                  to: {
                    id: invite.to.id,
                    name: invite.to.name,
                  },
                })),
                managers: app.managers.map(manager => ({
                  role: apiAppRoleToLocal(manager.role),
                  user: {
                    id: manager.user.id,
                    name: manager.user.name,
                  },
                })),
              }
              : null
          )),
        );
      }),
    }));
  });
}
