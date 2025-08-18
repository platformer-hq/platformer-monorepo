import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { useMutationFn } from '@/queries/useMutationFn';

import {
  RemoveManager,
  type RemoveManagerMutation,
  type RemoveManagerMutationVariables,
} from '../operations';
import { setAppManagersViewQueryData } from '../query-options';

export function useRemoveManager(appId: number, onSuccess: () => void) {
  const client = useQueryClient();
  return useMutation<
    RemoveManagerMutation,
    unknown,
    RemoveManagerMutationVariables
  >({
    mutationFn: useMutationFn(RemoveManager),
    onSuccess(_, vars) {
      setAppManagersViewQueryData([appId], client, prev => {
        if (prev?.app) {
          prev.app.managers = prev.app.managers.filter(m => m.user.id !== vars.userID);
          return prev;
        }
      });
      onSuccess();
    },
  });
}
