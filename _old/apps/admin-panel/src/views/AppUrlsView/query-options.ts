import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppUrlsViewData, type AppUrlsViewDataQuery } from './operations.js';

export function appUrlsViewQueryKey(id: number) {
  return ['app-urls-view-data', id] as const;
}

export function useAppUrlsViewQueryOptions(id: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appUrlsViewQueryKey(id),
    queryFn: ({ signal, queryKey: [, appID] }) => request(AppUrlsViewData, { appID }, signal),
  });
}

export const setAppUrlsViewQueryData = createQueryDataSetterDynamic<
  AppUrlsViewDataQuery,
  typeof appUrlsViewQueryKey
>(appUrlsViewQueryKey);
