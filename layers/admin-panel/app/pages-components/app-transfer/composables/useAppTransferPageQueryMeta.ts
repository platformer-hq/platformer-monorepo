import * as fp from 'fp-ts';

import { AppTransferPageDataDocument } from '../operations';

export function useAppTransferPageQueryMeta() {
  return useQueryMeta(({ request }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppTransferPageDataDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            request(AppTransferPageDataDocument, { appId }),
            fp.taskEither.map(({ app, currentUser }) => ({
              currentUserId: currentUser.id,
              ...(app
                ? {
                  currentUserRole: apiAppRoleToLocal(app.currentUserRole),
                  transferRequest: app.transferRequest,
                }
                : undefined),
            })),
          ),
        );
      },
    }));
  });
}
