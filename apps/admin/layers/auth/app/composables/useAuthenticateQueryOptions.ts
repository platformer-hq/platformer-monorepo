import * as fp from 'fp-ts';

import { AuthenticateDocument } from './_api/operations';

export function useAuthenticateQueryOptions() {
  const request = useMakeApiGqlRequest();
  const { initDataRaw } = useTmaStore();
  return defineQueryOptions({
    key: [AuthenticateDocument],
    query: throwify(() => {
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
