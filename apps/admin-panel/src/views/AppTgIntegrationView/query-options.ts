import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { AppTgIntegrationViewData, type AppTgIntegrationViewDataQuery } from './operations.js';

export function appTgIntegrationViewQueryKey(appId: number) {
  return ['app-tg-integration-view-data', appId] as const;
}

export function useAppTgIntegrationViewQueryOptions(id: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appTgIntegrationViewQueryKey(id),
    queryFn: ({ signal, queryKey: [, appID] }) => {
      return request(AppTgIntegrationViewData, { appID }, signal);
    },
    select: r => r.app,
  });
}

export const setAppTgIntegrationViewQueryData = createQueryDataSetterDynamic<
  AppTgIntegrationViewDataQuery,
  typeof appTgIntegrationViewQueryKey
>(appTgIntegrationViewQueryKey);
