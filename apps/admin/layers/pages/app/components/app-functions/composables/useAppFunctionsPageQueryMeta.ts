import * as fp from 'fp-ts';

import { AppFunctionsDocument } from '../operations';

export function useAppFunctionsPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppFunctionsDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppFunctionsDocument, { appId }),
            fp.taskEither.map(r => {
              return r.app
                ? ({
                  currentUserRole: apiAppRoleToLocal(r.app.currentUserRole),
                  functions: r.app.functions.map(fn => ({
                    id: fn.id,
                    enabled: fn.enabled,
                    name: fn.name,
                  })),
                  maxFunctionsCount: r.app.limits.functions.maxCount,
                })
                : null;
            }),
          ),
        );
      },
    }));
  });
}
