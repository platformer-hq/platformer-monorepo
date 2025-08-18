<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { useGqlRequest } from '@/queries/useGqlRequest.js';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

import {
  UpdatePermissions,
  type UpdatePermissionsMutation,
  type UpdatePermissionsMutationVariables,
} from './operations.js';
import { setPrivacyViewQueryData, usePrivacyViewQueryOptions } from './query-options.js';
import ReadyLayout from './ReadyLayout.vue';

const request = useGqlRequest();
const client = useQueryClient();
const { data } = useQuery(usePrivacyViewQueryOptions());

const { value: initial } = data;
const canAcceptAppTransfers = ref(initial ? initial.canAcceptAppTransfers : false);
const canBeInvitedToManage = ref(initial ? initial.canBeInvitedToManage : false);

watch(data, value => {
  if (value) {
    canAcceptAppTransfers.value = value.canAcceptAppTransfers;
    canBeInvitedToManage.value = value.canBeInvitedToManage;
  }
});

const {
  mutate: updateProfile,
  isPending: isUpdating,
} = useMutation<UpdatePermissionsMutation, unknown, UpdatePermissionsMutationVariables>({
  mutationFn: vars => request(UpdatePermissions, vars),
  onSuccess(_data, variables) {
    setPrivacyViewQueryData(client, data => {
      if (data) {
        data.currentUser = { ...data.currentUser, ...variables };
        return data;
      }
    });
  },
});

const showMainButton = computed(() => {
  const initialData = data.value;
  return initialData && (
    canBeInvitedToManage.value !== initialData.canBeInvitedToManage
    || canAcceptAppTransfers.value !== initialData.canAcceptAppTransfers
  );
});

const { t } = useI18n({
  messages: {
    en: { save: 'Save' },
    ru: { save: 'Сохранить' },
  },
});

watchEffect(() => {
  if (showMainButton.value) {
    setMainButtonParams({
      text: t('save'),
      isVisible: true,
      isEnabled: !isUpdating.value,
      isLoaderVisible: isUpdating.value,
    });
    onWatcherCleanup(
      onMainButtonClick(() => {
        updateProfile({
          canBeInvitedToManage: canBeInvitedToManage.value,
          canAcceptAppTransfers: canAcceptAppTransfers.value,
        });
      }),
    );
    return;
  }
  setMainButtonParams({ isVisible: false });
});
</script>

<template>
  <Page preserve-main-button>
    <PagePaddings>
      <ReadyLayout
        v-if="data"
        v-model:can-accept-app-transfers="canAcceptAppTransfers"
        v-model:can-be-invited-to-manage="canBeInvitedToManage"
      />
      <PageLoading v-else />
    </PagePaddings>
  </Page>
</template>
