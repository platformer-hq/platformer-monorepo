import * as fp from 'fp-ts';

import { AppUrlsPageDataDocument } from '../operations';

export function useAppUrlsPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppUrlsPageDataDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppUrlsPageDataDocument, { appId }),
            fp.taskEither.map(({ app, platforms }) => {
              return {
                app: app
                  ? {
                    role: apiAppRoleToLocal(app.currentUserRole),
                    urls: app.urls.map(u => ({
                      platformId: u.platform.id,
                      url: u.url,
                    })),
                  }
                  : undefined,
                platforms: platforms.map(p => ({
                  id: p.id,
                  title: p.title,
                  vendor: p.vendor.title,
                })),
              };
            }),
          ),
        );
      },
    }));
  });
}
