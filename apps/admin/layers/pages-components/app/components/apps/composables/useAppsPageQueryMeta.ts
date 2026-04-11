import { AppPrivacy, AppRole } from '@workspace/api/schema';
import * as fp from 'fp-ts';

import { AppsPageDataDocument } from '../operations';

export function useAppsPageQueryMeta() {
  return useNonParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions({
      key: [AppsPageDataDocument],
      query: throwify(() => {
        return fp.function.pipe(
          apiGqlRequest(AppsPageDataDocument, {}),
          fp.taskEither.map(({ currentUser }) => {
            return {
              apps: currentUser.apps.map(({ app, role }) => ({
                id: app.id,
                title: app.title,
                isPublic: app.privacy === AppPrivacy.Visible,
                role: ({
                  [AppRole.Admin]: 'admin',
                  [AppRole.Owner]: 'owner',
                  [AppRole.Member]: 'member',
                } as const)[role],
              })),
              maxOwnedAppsCount: currentUser.limits.maxOwnedAppsCount ?? undefined,
            };
          }),
        );
      }),
    });
  });
}
