<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';
import { setAppTestGroupsViewQueryData } from '@/views/AppTestGroupsView/query-options';
import TestGroupEditorView from '@/views/TestGroupEditorView/TestGroupEditorView.vue';

import {
  DeleteTestGroup,
  type DeleteTestGroupMutation,
  type DeleteTestGroupMutationVariables,
  UpdateTestGroup,
  type UpdateTestGroupMutation,
  type UpdateTestGroupMutationVariables,
} from './operations';
import { setAppTestGroupViewQueryData, useAppTestGroupViewQueryOptions } from './query-options';

const router = useRouter();
const testGroupIdParam = useRoute().params.testGroupId;
const testGroupId = parseInt(
  Array.isArray(testGroupIdParam) ? testGroupIdParam[0] : testGroupIdParam,
);
const appId = useAppIDFromParams();

const client = useQueryClient();
const {
  data: viewData,
  isPending: isLoadingViewData,
} = useQuery(useAppTestGroupViewQueryOptions(appId, testGroupId));
const {
  mutate: deleteTestGroup,
  isPending: isDeletingTestGroup,
} = useMutation<DeleteTestGroupMutation, unknown, DeleteTestGroupMutationVariables>({
  mutationKey: ['delete-app-test-group', testGroupId],
  mutationFn: useMutationFn(DeleteTestGroup),
  onSuccess(_, vars) {
    setAppTestGroupsViewQueryData([appId], client, prev => {
      if (prev?.app) {
        prev.app.testGroups = prev.app.testGroups.filter(group => group.id !== vars.testGroupID);
        return prev;
      }
    });
    router.go(-1);
  },
});
const {
  mutate: updateTestGroup,
  isPending: isUpdatingTestGroup,
} = useMutation<UpdateTestGroupMutation, unknown, UpdateTestGroupMutationVariables>({
  mutationKey: ['update-app-test-group', testGroupId],
  mutationFn: useMutationFn(UpdateTestGroup),
  onSuccess(response, vars) {
    setAppTestGroupViewQueryData([appId, vars.testGroupID], client, prev => {
      if (prev) {
        prev.appTestGroup = response.updateAppTestGroup;
        return prev;
      }
    });

    setAppTestGroupsViewQueryData([appId], client, prev => {
      if (prev?.app) {
        const { updateAppTestGroup: updatedTestGroup } = response;
        const idx = prev.app.testGroups.findIndex(group => group.id === vars.testGroupID);
        if (idx >= 0) {
          prev.app.testGroups[idx] = updatedTestGroup;
        } else {
          prev.app.testGroups.push(updatedTestGroup);
        }
        return prev;
      }
    });
  },
});

const isMutating = computed(() => isDeletingTestGroup.value || isUpdatingTestGroup.value);
const app = computed(() => (viewData.value ? viewData.value.app : undefined));
const testGroup = computed(() => (viewData.value ? viewData.value.appTestGroup : undefined));
const platformIds = computed(() => {
  return testGroup.value ? testGroup.value.platforms.map(p => p.id) : undefined;
});
const hasActiveSub = computed(() => {
  const endsAt = viewData.value?.app?.subscription?.endsAt;
  return endsAt ? Date.now() < new Date(endsAt).getTime() : false;
});
</script>

<template>
  <Page v-if="(!app || !testGroup) && isLoadingViewData">
    <PagePaddings>
      <PageLoading />
    </PagePaddings>
  </Page>
  <AppNotFoundView v-else-if="!app || !testGroup" />
  <TestGroupEditorView
    v-else
    :app-id
    :can-increase-limits="!hasActiveSub"
    :enabled="testGroup.enabled"
    :title="testGroup.title"
    :url="testGroup.url"
    :platform-ids
    :users="testGroup.users"
    :readonly="!isEditorAppRole(app.currentUserRole)"
    :loading="isMutating"
    :max-users="app.limits.maxTestGroupUsersCount"
    @delete="deleteTestGroup({ testGroupID: testGroupId })"
    @update="updateTestGroup({
      userIDs: $event.users.map(u => u.id),
      platformIDs: $event.platformIDs,
      title: $event.title,
      enabled: $event.enabled,
      testGroupID: testGroupId,
      url: $event.url,
    })"
  />
</template>
