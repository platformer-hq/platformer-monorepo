import * as fp from 'fp-ts';

import { AppTelegramUrlDocument } from '../_api/operations';

export function useAppUrl(options: {
  params: MaybeRefOrGetter<{
    appId: number;
    platform: string;
    initData: string;
    timeout?: number;
  } | undefined>;
  onSuccess(data: {
    app?: { url?: string };
  }): void;
  onError(error: unknown): void;
  onStarted(): void;
}) {
  const { apiGqlRequest } = useApiStore();
  const queryOptions = computed(() => {
    return toValue(options.params) || { appId: 0, platform: '', initData: '' };
  });

  const query = useQuery({
    enabled: () => !!toValue(options.params),
    key: () => [AppTelegramUrlDocument, queryOptions.value],
    query() {
      return throwifyAnyEither(
        fp.function.pipe(
          apiGqlRequest(AppTelegramUrlDocument, queryOptions.value, {
            timeout: toValue(options.params)?.timeout,
          }),
          fp.taskEither.map(({ app }) => ({
            app: app ? { url: app.telegramUrl || undefined } : undefined,
          })),
        ),
      );
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  watch(query.data, data => {
    if (data) {
      options.onSuccess(data);
    }
  });

  watch(query.error, error => {
    if (error) {
      options.onError(error);
    }
  });

  watch(query.isLoading, (isLoading, prevIsLoading) => {
    if (!prevIsLoading && isLoading) {
      options.onStarted();
    }
  });

  return query;
}
