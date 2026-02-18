<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useGqlRequest } from '@/queries/useGqlRequest';
import { useMutationFn } from '@/queries/useMutationFn';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';
import { setAppTestGroupsViewQueryData } from '@/views/AppTestGroupsView/query-options';
import TestGroupEditorView from '@/views/TestGroupEditorView/TestGroupEditorView.vue';

import {
  AppTestGroupCreateViewData,
  CreateAppTestGroup,
  type CreateAppTestGroupMutation,
  type CreateAppTestGroupMutationVariables,
} from './operations';

const router = useRouter();

const appId = useAppIDFromParams();
const client = useQueryClient();
const request = useGqlRequest();
const { data: viewData, isPending: isLoadingViewData } = useQuery({
  queryKey: ['app-test-group-create-view-data', appId] as const,
  queryFn({ signal, queryKey: [, appId] }) {
    return request(AppTestGroupCreateViewData, { appId }, signal);
  },
  select: r => r.app,
});
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

const hasActiveSub = computed(() => {
  const endsAt = viewData.value?.subscription?.endsAt;
  return endsAt ? Date.now() < new Date(endsAt).getTime() : false;
});
</script>

<template>
  <Page v-if="!viewData && isLoadingViewData">
    <PagePaddings>
      <PageLoading />
    </PagePaddings>
  </Page>
  <AppNotFoundView v-else-if="!viewData" />
  <TestGroupEditorView
    v-else
    :loading="isCreating"
    :can-increase-limits="!hasActiveSub"
    :app-id
    :max-users="viewData.limits.maxTestGroupUsersCount"
    @create="createTestGroup({ ...$event, appID: appId })"
  />
</template>
