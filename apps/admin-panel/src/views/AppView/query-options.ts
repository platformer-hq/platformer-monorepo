import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppViewData, type AppViewDataQuery } from './operations.js';

export function appViewQueryKey(id: number) {
  return ['app-view-data', id] as const;
}

export function useAppViewQueryOptions(id: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appViewQueryKey(id),
    queryFn: ({ signal }) => request(AppViewData, { appID: id }, signal),
    select: r => r.app,
  });
}

export const setAppViewQueryData = createQueryDataSetterDynamic<
  AppViewDataQuery,
  typeof appViewQueryKey
>(appViewQueryKey);
