import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppTestGroupsViewData, type AppTestGroupsViewDataQuery } from './operations.js';

export function appTestGroupsViewQueryKey(id: number) {
  return ['app-test-groups-view-data', id] as const;
}

export function useAppTestGroupsViewQueryOptions(id: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appTestGroupsViewQueryKey(id),
    queryFn: ({ signal, queryKey: [, appID] }) => request(AppTestGroupsViewData, { appID }, signal),
    select: r => r.app,
  });
}

export const setAppTestGroupsViewQueryData = createQueryDataSetterDynamic<
  AppTestGroupsViewDataQuery,
  typeof appTestGroupsViewQueryKey
>(appTestGroupsViewQueryKey);
