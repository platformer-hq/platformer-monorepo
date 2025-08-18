import { queryOptions } from '@tanstack/vue-query';

import {
  createQueryDataRefetcherDynamic,
  createQueryDataSetterDynamic,
} from '@/queries/query-data.vue';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppSubscriptionViewData, type AppSubscriptionViewDataQuery } from './operations.js';

export function appSubscriptionViewQueryKey(appId: number) {
  return ['app-subscription-view-data', appId] as const;
}

export function useAppSubscriptionViewQueryOptions(appId: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appSubscriptionViewQueryKey(appId),
    queryFn: ({ signal }) => {
      return request(AppSubscriptionViewData, { appId }, signal);
    },
    select: r => r.app,
  });
}

export const setAppSubscriptionViewQueryData = createQueryDataSetterDynamic<
  AppSubscriptionViewDataQuery,
  typeof appSubscriptionViewQueryKey
>(appSubscriptionViewQueryKey);

export const refetchAppSubscriptionView =
  createQueryDataRefetcherDynamic(appSubscriptionViewQueryKey);
