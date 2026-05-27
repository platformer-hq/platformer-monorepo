import * as fp from 'fp-ts';

import { AppCachePageDataDocument } from '../operations';

export function useAppCachePageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppCachePageDataDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppCachePageDataDocument, { appID: appId }),
            fp.taskEither.map(({ app }) => (
              app
                ? {
                  urlsCacheResetAt: app.urlsCacheResetAt
                    ? new Date(app.urlsCacheResetAt)
                    : undefined,
                }
                : null
            )),
          ),
        );
      },
    }));
  });
}
