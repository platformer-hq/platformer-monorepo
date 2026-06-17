import * as fp from 'fp-ts';

import { AppServerlessFunctionsDocument } from '../operations';

export function useAppServerlessFunctionsPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppServerlessFunctionsDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppServerlessFunctionsDocument, { appId }),
            fp.taskEither.map(r => {
              return r.app
                ? ({
                  currentUserRole: apiAppRoleToLocal(r.app.currentUserRole),
                  serverlessFunctions: r.app.serverlessFunctions.map(fn => ({
                    id: fn.id,
                    enabled: fn.enabled,
                    name: fn.name,
                  })),
                  maxServerlessFunctionsCount: r.app.limits.serverlessFunctions.maxCount,
                })
                : null;
            }),
          ),
        );
      },
    }));
  });
}
