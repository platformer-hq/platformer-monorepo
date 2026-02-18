import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetter } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { Permissions, type PermissionsQuery } from './operations.js';

export function privacyViewQueryKey() {
  return ['privacy-view-data'] as const;
}

export function usePrivacyViewQueryOptions() {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: privacyViewQueryKey(),
    queryFn: ({ signal }) => request(Permissions, {}, signal),
    select: r => r.currentUser,
  });
}

export const setPrivacyViewQueryData = createQueryDataSetter<
  PermissionsQuery,
  ReturnType<typeof privacyViewQueryKey>
>(privacyViewQueryKey);
