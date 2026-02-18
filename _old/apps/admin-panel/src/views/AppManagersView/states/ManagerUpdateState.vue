<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { AppManagementInviteRole, AppRole } from 'schema';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { appRoleToInvitable } from '../converters';
import UserSelectedState from './UserSelectedState.vue';

const { loading, role: initialRawRole, userId, userName } = defineProps<{
  role: AppRole;
  userId: number;
  userName: string;
  loading: boolean;
}>();
const emit = defineEmits<{
  back: [];
  remove: [];
  update: [{ role: AppManagementInviteRole }];
}>();

const { t } = useI18n({
  messages: {
    en: {
      confirmRemoveTitle: 'Confirm removal',
      confirmRemoveMessage: 'Are you sure you want to remove {name} from the application managers?',
      confirmRemoveCancel: 'Cancel',
      confirmRemoveConfirm: 'Remove {name}',
      removeManager: 'Remove manager',
      invite: 'Invite',
      update: 'Update',
    },
    ru: {
      confirmRemoveTitle: 'Подтвердите удаление',
      confirmRemoveMessage: 'Вы уверены, что хотите удалить {name} из списка менеджеров?',
      confirmRemoveCancel: 'Отмена',
      confirmRemoveConfirm: 'Удалить {name}',
      removeManager: 'Удалить менеджера',
      invite: 'Пригласить',
      update: 'Обновить',
    },
  },
});

const initialRole = computed(() => appRoleToInvitable(initialRawRole));
const role = ref(initialRole.value);

watchEffect(() => {
  onWatcherCleanup(onMainButtonClick(() => {
    !loading && emit('update', { role: role.value });
  }));
});

watchEffect(() => {
  setMainButtonParams(role.value === initialRole.value
    ? { isVisible: false }
    : {
      isVisible: true,
      text: t('update'),
      isEnabled: !loading,
      isLoaderVisible: loading,
    });
});
</script>

<template>
  <UserSelectedState
    :user-id="userId"
    :user-name="userName"
    :role="role"
    :lock-controls="loading"
    @back="$emit('back')"
    @remove="$emit('remove')"
    @role-changed="role = $event.role"
  />
</template>
