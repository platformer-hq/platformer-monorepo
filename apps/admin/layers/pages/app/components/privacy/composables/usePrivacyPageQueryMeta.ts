import * as fp from 'fp-ts';

import { PrivacyPageDataDocument } from '../operations';

export function usePrivacyPageQueryMeta() {
  return useNonParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions({
      key: [PrivacyPageDataDocument],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(PrivacyPageDataDocument, {}),
            fp.taskEither.map(({ currentUser }) => ({
              canAcceptAppTransfers: currentUser.canAcceptAppTransfers,
              canBeInvitedToManage: currentUser.canBeInvitedToManage,
            })),
          ),
        );
      },
    });
  });
}
