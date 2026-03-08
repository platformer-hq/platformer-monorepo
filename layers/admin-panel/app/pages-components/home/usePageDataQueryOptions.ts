import { queryOptions } from '@tanstack/vue-query';
import { function as fn, taskEither } from 'fp-ts';

import { HomePageDataDocument } from './operations';

type Err = ApiGraphQLError;
interface Result {
  transferRequestsCount: number;
  invitesCount: number;
}

export function usePageDataQueryOptions() {
  const request = useMakeGqlApiRequest();
  const queryKey = [HomePageDataDocument] as const;
  return queryOptions<Result, Err, Result, typeof queryKey>({
    queryKey,
    queryFn: throwify(() => {
      return fn.pipe(
        request(HomePageDataDocument, {}),
        taskEither.map(({ currentUser }) => ({
          transferRequestsCount: currentUser.appTransferRequests.length,
          invitesCount: currentUser.managementInvites.length,
        })),
      );
    }),
  });
}
