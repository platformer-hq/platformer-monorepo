import { queryOptions } from '@tanstack/vue-query';
import * as fp from 'fp-ts';

import { AuthenticateDocument } from './_api/operations';

export function useAuthenticateQueryOptions() {
  const request = useMakeGqlApiRequest();
  const { initDataRaw } = useTmaStore();
  return queryOptions({
    queryKey: [AuthenticateDocument],
    queryFn: throwify(() => {
      return fp.function.pipe(
        request(AuthenticateDocument, { initData: initDataRaw }),
        fp.taskEither.map(({ authenticateTelegram }) => ({
          token: authenticateTelegram.token,
          expiresAt: new Date(authenticateTelegram.expiresAt),
        })),
      );
    }),
  });
}
