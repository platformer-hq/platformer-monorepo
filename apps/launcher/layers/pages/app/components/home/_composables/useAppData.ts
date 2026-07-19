import * as fp from 'fp-ts';

import { AppDataDocument } from '../_api/operations';

export function useAppData(options: {
  params: MaybeRefOrGetter<{
    appId: number;
    timeout?: number;
  } | undefined>;
  onError(error: unknown): void;
}) {
  const { apiGqlRequest } = useApiStore();

  const query = useQuery({
    enabled: () => toValue(options.params)?.appId !== undefined,
    key: [AppDataDocument, toValue(options.params)?.appId || 0],
    query() {
      return throwifyAnyEither(
        fp.function.pipe(
          apiGqlRequest(AppDataDocument, { appId: toValue(options.params)?.appId ?? 0 }, {
            timeout: toValue(options.params)?.timeout,
          }),
          fp.taskEither.map(({ app }) => ({
            app: app
              ? { splashScreenIconUrl: app.splashScreenIconUrl }
              : undefined,
          })),
        ),
      );
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ssrCatchError: true,
  });

  watch(query.error, error => {
    if (error) {
      options.onError(error);
    }
  });

  return query;
}
