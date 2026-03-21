import * as fp from 'fp-ts';

import { TransferRequestsPageDataDocument } from '../operations';

export function useTransferRequestsPageQueryMeta() {
  return useQueryMeta(({ request }) => defineQueryOptions({
    key: [TransferRequestsPageDataDocument],
    query: throwify(() => {
      return fp.function.pipe(
        request(TransferRequestsPageDataDocument, {}),
        fp.taskEither.map(r => r.currentUser.appTransferRequests),
      );
    }),
  }));
}
