import { queryOptions } from '@tanstack/vue-query';
import * as fp from 'fp-ts';

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
      return fp.function.pipe(
        request(HomePageDataDocument, {}),
        fp.taskEither.map(({ currentUser }) => ({
          transferRequestsCount: currentUser.appTransferRequests.length,
          invitesCount: currentUser.managementInvites.length,
        })),
      );
    }),
  });
}
