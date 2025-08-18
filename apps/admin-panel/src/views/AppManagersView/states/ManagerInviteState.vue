<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { AppManagementInviteRole } from 'schema';
import { onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import UserSelectedState from './UserSelectedState.vue';

const { loading, userId, userName } = defineProps<{
  userId: number;
  userName: string;
  loading: boolean;
}>();
const emit = defineEmits<{
  back: [];
  invite: [{ role: AppManagementInviteRole }];
}>();

const { t } = useI18n({
  messages: {
    en: { invite: 'Invite' },
    ru: { invite: 'Пригласить' },
  },
});

const role = ref(AppManagementInviteRole.Admin);

watchEffect(() => {
  setMainButtonParams({
    isVisible: true,
    text: t('invite'),
    isEnabled: !loading,
    isLoaderVisible: loading,
  });
  onWatcherCleanup(onMainButtonClick(() => {
    !loading && emit('invite', { role: role.value });
  }));
});
</script>

<template>
  <UserSelectedState
    :user-id="userId"
    :user-name="userName"
    :role="role"
    @back="$emit('back')"
    @role-changed="role = $event.role"
  />
</template>
