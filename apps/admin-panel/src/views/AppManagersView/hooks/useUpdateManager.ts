import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { useMutationFn } from '@/queries/useMutationFn';

import { appRoleInvitableToStatic } from '../converters';
import {
  UpdateManager,
  type UpdateManagerMutation,
  type UpdateManagerMutationVariables,
} from '../operations';
import { setAppManagersViewQueryData } from '../query-options';

export function useUpdateManager(appId: number, onSuccess: () => void) {
  const client = useQueryClient();
  return useMutation<
    UpdateManagerMutation,
    unknown,
    UpdateManagerMutationVariables
  >({
    mutationFn: useMutationFn(UpdateManager),
    onSuccess(_, vars) {
      setAppManagersViewQueryData([appId], client, prev => {
        if (prev?.app) {
          const manager = prev.app.managers.find(m => m.user.id === vars.userID);
          if (manager) {
            manager.role = appRoleInvitableToStatic(vars.role);
          }
          return prev;
        }
      });
      onSuccess();
    },
  });
}
