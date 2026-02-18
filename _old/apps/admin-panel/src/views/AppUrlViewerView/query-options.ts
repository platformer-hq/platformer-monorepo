import { queryOptions, skipToken, type QueryFunction, type SkipToken } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppUrlViewerViewData, type AppUrlViewerViewDataQuery } from './operations.js';

export function appUrlViewerViewQueryKey(id: number, userId: Ref<number>) {
  return ['app-url-viewer-view-data', id, userId] as const;
}

export function useAppUrlViewerViewQueryOptions(id: number, userId: Ref<number | undefined>) {
  const request = useGqlRequest();

  return queryOptions({
    queryKey: appUrlViewerViewQueryKey(id, computed(() => userId.value || -1)),
    queryFn: computed<
      | QueryFunction<
        AppUrlViewerViewDataQuery,
        readonly ['app-url-viewer-view-data', appId: number, userId: number]
      >
      | SkipToken
    >(() => {
      return !userId.value
        ? skipToken
        : ({ signal, queryKey: [, appID, userID] }) => {
          return request(AppUrlViewerViewData, { appID, userID }, signal);
        };
    }),
    select: r => [...r.userAppURLExplanations].sort((a, b) => {
      return a.platform.completeTitle.localeCompare(b.platform.completeTitle);
    }),
  });
}
