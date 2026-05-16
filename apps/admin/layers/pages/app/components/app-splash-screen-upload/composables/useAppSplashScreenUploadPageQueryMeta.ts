import { objectPick } from '@vueuse/core';
import * as fp from 'fp-ts';

import { AppSplashScreenUploadPageDataDocument } from '../operations';

export function useAppSplashScreenUploadPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppSplashScreenUploadPageDataDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppSplashScreenUploadPageDataDocument, { appId }),
            fp.taskEither.map(r => ({
              iconUrl: r.app?.splashScreenIconUrl || undefined,
              // iconUrl: null,
              rules: objectPick(r.appSplashScreenIconUploadRules.svg, [
                'allowedAttrs', 'allowedTags', 'maxSize', 'xmlns',
              ]),
            })),
          ),
        );
      },
    }));
  });
}
