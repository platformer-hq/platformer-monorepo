import * as fp from 'fp-ts';

import { AppSplashScreenPageDataDocument } from '../operations';

export function useAppSplashScreenPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppSplashScreenPageDataDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppSplashScreenPageDataDocument, { appId }),
            fp.taskEither.map(r => ({
              iconUrl: r.app?.splashScreenIconUrl || undefined,
              // iconUrl: null,
            })),
          ),
        );
      },
    }));
  });
}
