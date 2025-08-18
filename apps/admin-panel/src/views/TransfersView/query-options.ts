import { queryOptions } from '@tanstack/vue-query';

import { createQueryDataSetter } from '@/queries/query-data.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { Data, type DataQuery } from './operations.js';

export function transfersViewQueryKey() {
  return ['transfers-view-data'] as const;
}

export function useTransfersViewQueryOptions() {
  const request = useGqlRequest();
  return queryOptions({
    queryKey: transfersViewQueryKey(),
    queryFn: ({ signal }) => request(Data, {}, signal),
    select: r => r.currentUser.appTransferRequests,
  });
}

export const setTransfersViewQueryData = createQueryDataSetter<
  DataQuery,
  ReturnType<typeof transfersViewQueryKey>
>(transfersViewQueryKey);
