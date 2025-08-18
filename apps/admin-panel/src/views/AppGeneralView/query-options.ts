import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.vue';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppGeneralViewData, type AppGeneralViewDataQuery } from './operations.js';

export function appGeneralViewQueryKey(id: number) {
  return ['app-general-view-data', id] as const;
}

export function useAppGeneralViewQueryOptions(id: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appGeneralViewQueryKey(id),
    queryFn: ({ signal, queryKey: [, appID] }) => request(AppGeneralViewData, { appID }, signal),
    select: r => r.app,
  });
}

export const setAppGeneralViewQueryData = createQueryDataSetterDynamic<
  AppGeneralViewDataQuery,
  typeof appGeneralViewQueryKey
>(appGeneralViewQueryKey);
