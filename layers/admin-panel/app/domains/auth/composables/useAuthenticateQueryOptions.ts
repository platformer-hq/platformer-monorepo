import { queryOptions } from '@tanstack/vue-query';
import { function as fn, taskEither } from 'fp-ts';

import { AuthenticateDocument } from './_api/operations';

export function useAuthenticateQueryOptions() {
  const request = useMakeGqlApiRequest();
  const { initDataRaw } = useTmaStore();
  return queryOptions({
    queryKey: [AuthenticateDocument],
    queryFn: throwify(() => {
      return fn.pipe(
        request(AuthenticateDocument, { initData: initDataRaw }),
        taskEither.map(({ authenticateTelegram }) => ({
          token: authenticateTelegram.token,
          expiresAt: new Date(authenticateTelegram.expiresAt),
        })),
      );
    }),
  });
}
