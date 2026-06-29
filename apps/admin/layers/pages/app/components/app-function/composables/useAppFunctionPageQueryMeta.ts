import * as fp from 'fp-ts';

import { AppFunctionsPageDataDocument } from '../operations';

export function useAppFunctionPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((options: { appId: number; fnId?: number }) => ({
      key: [AppFunctionsPageDataDocument, options.appId, options.fnId || 0],
      query: throwify(() => {
        return fp.function.pipe(
          apiGqlRequest(AppFunctionsPageDataDocument, {
            appId: options.appId,
            funcId: options.fnId || 0,
            skipFuncData: options.fnId === undefined,
          }),
          fp.taskEither.map(({ app, appFunction }) => {
            return app
              ? {
                currentUserRole: apiAppRoleToLocal(app.currentUserRole),
                limits: {
                  maxCodeLength: app.limits.functions.maxCodeLength || undefined,
                  maxNameLength: app.limits.functions.maxNameLength || undefined,
                },
                function: appFunction
                  ? {
                    id: appFunction.id,
                    name: appFunction.name,
                    code: appFunction.code,
                    enabled: appFunction.enabled,
                  }
                  : null,
              }
              : null;
          }),
        );
      }),
    }));
  });
}
