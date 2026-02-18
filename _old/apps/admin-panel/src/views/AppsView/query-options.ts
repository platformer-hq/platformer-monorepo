import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataRefetcher, createQueryDataSetter } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { Data, type DataQuery } from './operations.js';

export function appsViewQueryKey() {
  return ['apps-view-data'] as const;
}

export function useAppsViewQueryOptions() {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appsViewQueryKey(),
    queryFn: ({ signal }) => request(Data, {}, signal),
    select: r => r.currentUser,
  });
}

export const setAppsViewQueryData = createQueryDataSetter<
  DataQuery,
  ReturnType<typeof appsViewQueryKey>
>(appsViewQueryKey);

export const refetchAppsViewQuery = createQueryDataRefetcher(appsViewQueryKey);
