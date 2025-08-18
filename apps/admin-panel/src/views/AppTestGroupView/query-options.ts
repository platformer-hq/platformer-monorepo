import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetterDynamic } from '@/queries/query-data.vue';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { TestGroupViewData, type TestGroupViewDataQuery } from './operations.js';

export function appTestGroupViewQueryKey(appId: number, testGroupId: number) {
  return ['app-test-group-view-data', appId, testGroupId] as const;
}

export function useAppTestGroupViewQueryOptions(appId: number, testGroupId: number) {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: appTestGroupViewQueryKey(appId, testGroupId),
    queryFn: ({ signal, queryKey: [, appID] }) => request(TestGroupViewData, {
      appID,
      testGroupID: testGroupId,
    }, signal),
  });
}

export const setAppTestGroupViewQueryData = createQueryDataSetterDynamic<
  TestGroupViewDataQuery,
  typeof appTestGroupViewQueryKey
>(appTestGroupViewQueryKey);
