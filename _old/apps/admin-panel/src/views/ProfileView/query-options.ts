import { queryOptions } from '@tanstack/vue-query';

import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { FullProfile } from './operations.js';

export function profileViewQueryKey() {
  return ['profile-view-data'] as const;
}

export function useProfileViewQueryOptions() {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: profileViewQueryKey(),
    queryFn: ({ signal }) => request(FullProfile, {}, signal),
    select: r => r.currentUser,
  });
}
