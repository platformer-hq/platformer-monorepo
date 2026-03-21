import * as fp from 'fp-ts';

import { TransferRequestsPageDataDocument } from '../operations';

export function useTransferRequestsPageQueryMeta() {
  return useNonParametrizedQueryMeta(({ apiGqlRequest }) => defineQueryOptions({
    key: [TransferRequestsPageDataDocument],
    query: throwify(() => {
      return fp.function.pipe(
        apiGqlRequest(TransferRequestsPageDataDocument, {}),
        fp.taskEither.map(r => r.currentUser.appTransferRequests),
      );
    }),
  }));
}
