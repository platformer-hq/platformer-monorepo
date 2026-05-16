import * as fp from 'fp-ts';

import { AppGeneralPageDataDocument } from '../operations';

export function useAppGeneralPageQueryMeta() {
  return useParametrizedQueryMeta(({ apiGqlRequest }) => {
    return defineQueryOptions((appId: number) => ({
      key: [AppGeneralPageDataDocument],
      query: throwify(() => {
        return fp.function.pipe(
          apiGqlRequest(AppGeneralPageDataDocument, { appId }),
          fp.taskEither.map(({ app }) => (
            app
              ? {
                title: app.title,
                privacy: apiAppPrivacyToLocal(app.privacy),
                role: apiAppRoleToLocal(app.currentUserRole),
              }
              : null
          )),
        );
      }),
    }));
  });
}
