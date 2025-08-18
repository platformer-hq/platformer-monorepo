<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { setAppTestGroupsViewQueryData } from '@/views/AppTestGroupsView/query-options';
import TestGroupEditorView from '@/views/TestGroupEditorView/TestGroupEditorView.vue';

import {
  CreateAppTestGroup,
  type CreateAppTestGroupMutation,
  type CreateAppTestGroupMutationVariables,
} from './operations';

const appId = useAppIDFromParams();
const client = useQueryClient();
const {
  mutate: createTestGroup,
  isPending: isCreating,
} = useMutation<CreateAppTestGroupMutation, unknown, CreateAppTestGroupMutationVariables>({
  mutationKey: ['create-app-test-group'],
  mutationFn: useMutationFn(CreateAppTestGroup),
  onSuccess(response) {
    setAppTestGroupsViewQueryData([appId], client, prev => {
      if (prev?.app) {
        prev.app.testGroups.push(response.createAppTestGroup);
        return prev;
      }
    });
    router.go(-1);
  },
  // FIXME: Handle max test groups count limit reached error. Also do the same for the test
  // groups page.
});
const router = useRouter();
</script>

<template>
  <TestGroupEditorView
    :loading="isCreating"
    @create="createTestGroup({ ...$event, appID: appId })"
  />
</template>
