import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.vue';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppTransferViewData, type AppTransferViewDataQuery } from './operations.js';

export function appTransferViewQueryKey(appId: number) {
  return ['app-transfer-view-data', appId] as const;
}

export function useAppTransferViewQueryOptions(appId: number) {
  const request = useGqlRequest();

  return queryOptions({
    queryKey: appTransferViewQueryKey(appId),
    queryFn({ signal, queryKey: [, appID] }) {
      return request(AppTransferViewData, { appID }, signal);
    },
    select: r => r.app,
  });
}

export const setAppTransferViewQueryData = createQueryDataSetterDynamic<
  AppTransferViewDataQuery,
  typeof appTransferViewQueryKey
>(appTransferViewQueryKey);
