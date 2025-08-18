import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { useMutationFn } from '@/queries/useMutationFn';

import {
  InviteManager,
  type InviteManagerMutation,
  type InviteManagerMutationVariables,
} from '../operations';
import { setAppManagersViewQueryData } from '../query-options';

export function useInviteManager(appId: number, onSuccess: () => void) {
  const client = useQueryClient();
  return useMutation<
    InviteManagerMutation,
    unknown,
    InviteManagerMutationVariables
  >({
    mutationFn: useMutationFn(InviteManager),
    onSuccess(response) {
      setAppManagersViewQueryData([appId], client, prev => {
        if (prev?.app) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createAppManagementInvite: { __typename, ...rest } } = response;
          prev.app.managementInvites.push(rest);
          return prev;
        }
      });
      onSuccess();
    },
  });
}
