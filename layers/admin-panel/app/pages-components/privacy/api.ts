import { queryOptions, useQueryClient } from '@tanstack/vue-query';
import { function as fn, taskEither } from 'fp-ts';

import { PrivacyPageDataDocument, UpdatePermissionsDocument } from './operations';

export function usePageDataQueryOptions() {
  const request = useMakeGqlApiRequest();
  return queryOptions({
    queryKey: [PrivacyPageDataDocument],
    queryFn: throwify(() => {
      return fn.pipe(
        request({ document: PrivacyPageDataDocument, variables: {} }),
        taskEither.map(({ currentUser }) => ({
          canAcceptAppTransfers: currentUser.canAcceptAppTransfers,
          canBeInvitedToManage: currentUser.canBeInvitedToManage,
        })),
      );
    }),
  });
}

export function useUpdateMutationOptions() {
  const request = useMakeGqlApiRequest();
  return {
    mutationKey: [UpdatePermissionsDocument],
    mutationFn: throwify((options: {
      canAcceptAppTransfers: boolean;
      canBeInvitedToManage: boolean;
    }) => {
      return request({
        document: UpdatePermissionsDocument,
        variables: {
          canAcceptAppTransfers: options.canAcceptAppTransfers,
          canBeInvitedToManage: options.canBeInvitedToManage,
        },
      });
    }),
  };
}

export function usePageDataMutator() {
  const queryClient = useQueryClient();
  return (options: {
    canAcceptAppTransfers: boolean;
    canBeInvitedToManage: boolean;
  }) => {
    queryClient.setQueryData([PrivacyPageDataDocument], {
      canAcceptAppTransfers: options.canAcceptAppTransfers,
      canBeInvitedToManage: options.canBeInvitedToManage,
    });
  };
}
