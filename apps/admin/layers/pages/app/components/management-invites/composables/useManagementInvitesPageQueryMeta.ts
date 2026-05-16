import * as fp from 'fp-ts';

import { ManagementInvitesPageDataDocument } from '../operations';

export function useManagementInvitesPageQueryMeta() {
  return useNonParametrizedQueryMeta(({ apiGqlRequest }) => defineQueryOptions({
    key: [ManagementInvitesPageDataDocument],
    query: throwify(() => {
      return fp.function.pipe(
        apiGqlRequest(ManagementInvitesPageDataDocument, {}),
        fp.taskEither.map(({ currentUser }) => currentUser.managementInvites.map(invite => ({
          ...invite,
          role: apiAppManagementInviteRoleToLocal(invite.role),
        }))),
      );
    }),
  }));
}
