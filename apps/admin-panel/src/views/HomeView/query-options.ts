import { queryOptions } from '@tanstack/vue-query';

import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { createQueryDataRefetcher } from '@/queries/query-data.vue';
import { Invites } from './operations.js';

export function homeViewQueryKey() {
  return ['home-view-data'] as const;
}

export function useHomeViewQueryOptions() {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: homeViewQueryKey(),
    queryFn: ({ signal }) => request(Invites, {}, signal),
    select: r => r.currentUser,
  });
}

export const refetchHomeViewQuery = createQueryDataRefetcher(homeViewQueryKey);
