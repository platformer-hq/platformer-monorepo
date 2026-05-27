import * as fp from 'fp-ts';

import { AppTgIntegrationPageDataDocument } from '../operations';

export function useAppTgIntegrationPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppTgIntegrationPageDataDocument, appId],
      query() {
        return throwifyAnyEither(
          fp.function.pipe(
            apiGqlRequest(AppTgIntegrationPageDataDocument, { appId }),
            fp.taskEither.map(({ app }) => (
              app
                ? {
                  role: apiAppRoleToLocal(app.currentUserRole),
                  botId: app.telegramBotID || undefined,
                }
                : null
            )),
          ),
        );
      },
    }));
  });
}
