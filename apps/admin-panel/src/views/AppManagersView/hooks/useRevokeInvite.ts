import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { useMutationFn } from '@/queries/useMutationFn';

import {
  RevokeInvite,
  type RevokeInviteMutation,
  type RevokeInviteMutationVariables,
} from '../operations';
import { setAppManagersViewQueryData } from '../query-options';

export function useRevokeInvite(appId: number) {
  const client = useQueryClient();
  return useMutation<
    RevokeInviteMutation,
    unknown,
    RevokeInviteMutationVariables
  >({
    mutationFn: useMutationFn(RevokeInvite),
    onSuccess(_, vars) {
      setAppManagersViewQueryData([appId], client, prev => {
        if (prev?.app) {
          prev.app.managementInvites = prev.app.managementInvites.filter(inv => {
            return inv.id !== vars.inviteID;
          });
          return prev;
        }
      });
    },
  });
}
