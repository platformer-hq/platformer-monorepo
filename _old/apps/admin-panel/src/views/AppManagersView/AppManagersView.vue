<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { AppRole } from 'schema';
import { computed, ref } from 'vue';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import UserSelectionView from '@/ui/components/UserSelectionView/UserSelectionView.vue';

import { useInviteManager } from './hooks/useInviteManager';
import { useRemoveManager } from './hooks/useRemoveManager';
import { useRevokeInvite } from './hooks/useRevokeInvite';
import { useUpdateManager } from './hooks/useUpdateManager';
import { useAppManagersViewQueryOptions } from './query-options';
import ManagerInviteState from './states/ManagerInviteState.vue';
import ManagersListState from './states/ManagersListState.vue';
import ManagerUpdateState from './states/ManagerUpdateState.vue';

const isSelectingUsers = ref(false);
const selectedUser = ref<{ id: number; name: string; role?: AppRole } | undefined>();
const dropSelectedUser = () => {
  selectedUser.value = undefined;
};

const appId = useAppIDFromParams();
const { data: viewData } = useQuery(useAppManagersViewQueryOptions(appId));
const { mutate: revokeInvite, isPending: isRevoking } = useRevokeInvite(appId);
const { mutate: inviteManager, isPending: isInviting } = useInviteManager(appId, dropSelectedUser);
const { mutate: updateManager, isPending: isUpdating } = useUpdateManager(appId, dropSelectedUser);
const { mutate: removeManager, isPending: isRemoving } = useRemoveManager(appId, dropSelectedUser);

const isMutating = computed(() => {
  return [isRevoking, isInviting, isUpdating, isRemoving].some(r => r.value);
});
const readonly = computed(() => {
  return !!viewData.value && !isEditorAppRole(viewData.value.currentUserRole);
});
const managers = computed(() => (viewData.value ? viewData.value.managers : []));
</script>

<template>
  <Page v-if="!viewData">
    <PagePaddings>
      <PageLoading />
    </PagePaddings>
  </Page>
  <template v-else-if="selectedUser">
    <ManagerUpdateState
      v-if="selectedUser.role"
      :user-id="selectedUser.id"
      :user-name="selectedUser.name"
      :role="selectedUser.role"
      :loading="isMutating"
      @update="updateManager({ appID: appId, role: $event.role, userID: selectedUser.id })"
      @remove="removeManager({ appID: appId, userID: selectedUser.id })"
      @back="dropSelectedUser"
    />
    <ManagerInviteState
      v-else
      :user-id="selectedUser.id"
      :user-name="selectedUser.name"
      :loading="isMutating"
      @back="dropSelectedUser"
      @invite="inviteManager({ appID: appId, role: $event.role, userID: selectedUser.id })"
    />
  </template>
  <template v-else-if="isSelectingUsers">
    <UserSelectionView
      search-for="management"
      :excluded-user-ids="[
        ...managers.map(m => m.user.id),
        ...viewData.managementInvites.map(inv => inv.to.id),
      ]"
      @back="isSelectingUsers = false"
      @user-selected="
        isSelectingUsers = false;
        selectedUser = $event;
      "
    />
  </template>
  <template v-else>
    <ManagersListState
      :managers="managers"
      :invites="viewData.managementInvites"
      :readonly="readonly"
      :loading="isMutating"
      @invite-click="isSelectingUsers = true"
      @revoke-invite="revokeInvite"
      @manager-click="selectedUser = $event"
    />
  </template>
</template>
