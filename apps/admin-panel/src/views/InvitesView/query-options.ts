import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetter } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { Data, type DataQuery } from './operations.js';

export function invitesViewQueryKey() {
  return ['invites-view-data'] as const;
}

export function useInvitesViewQueryOptions() {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: invitesViewQueryKey(),
    queryFn: ({ signal }) => request(Data, {}, signal),
    select: r => r.currentUser.managementInvites,
  });
}

export const setInvitesViewQueryData = createQueryDataSetter<
  DataQuery,
  ReturnType<typeof invitesViewQueryKey>
>(invitesViewQueryKey);
