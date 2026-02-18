import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppManagersViewData, type AppManagersViewDataQuery } from './operations.js';

export function appManagersViewQueryKey(id: number) {
  return ['app-managers-view-data', id] as const;
}

export function useAppManagersViewQueryOptions(id: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appManagersViewQueryKey(id),
    queryFn: ({ signal, queryKey: [, appID] }) => request(AppManagersViewData, { appID }, signal),
    select: r => r.app,
  });
}

export const setAppManagersViewQueryData = createQueryDataSetterDynamic<
  AppManagersViewDataQuery,
  typeof appManagersViewQueryKey
>(appManagersViewQueryKey);
