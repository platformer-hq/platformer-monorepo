<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import { AppManagementInviteRole } from 'schema';
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRightLabel from '@/ui/adapters/ListItemBodyRightLabel';
import ListItemBodyRightRadio from '@/ui/adapters/ListItemBodyRightRadio';
import Page from '@/ui/components/Page.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

defineProps<{
  lockControls?: boolean;
  role: AppManagementInviteRole;
  userId: number;
  userName: string;
  onRemove?: () => void;
}>();
defineEmits<{
  back: [];
  remove: [];
  roleChanged: [{ role: AppManagementInviteRole }];
}>();

const { t } = useI18n({
  messages: {
    en: {
      selectedUserTitle: 'Selected user',
      roleTitle: 'Role',
      admin: 'Admin',
      adminSubtitle: 'Complete access over the application',
      member: 'Member',
      memberSubtitle: 'Read-only access',
      removeManager: 'Remove manager',
    },
    ru: {
      selectedUserTitle: 'Выбранный пользователь',
      roleTitle: 'Роль',
      admin: 'Администратор',
      adminSubtitle: 'Полный контроль над приложением',
      member: 'Участник',
      memberSubtitle: 'Доступ только на чтение',
      removeManager: 'Удалить менеджера',
    },
  },
});
</script>

<template>
  <Page
    preserve-main-button
    @back="$emit('back')"
  >
    <PagePaddings>
      <List :title="t('selectedUserTitle')">
        <ListItem>
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ userName }}
            </ListItemBodyLeftLabel>
          </template>
          <template #bodyRightLabel>
            <ListItemBodyRightLabel>
              #{{ userId }}
            </ListItemBodyRightLabel>
          </template>
        </ListItem>
      </List>
      <List
        class="list"
        :title="t('roleTitle')"
      >
        <ListItem
          v-for="item in [
            { role: AppManagementInviteRole.Admin, subtitle: t('adminSubtitle') },
            { role: AppManagementInviteRole.Member, subtitle: t('memberSubtitle') }
          ]"
          :key="item.role"
          large
          clickable
          @click="
            $emit('roleChanged', { role: item.role });
            hapticFeedbackSelectionChanged();
          "
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ t({
                [AppManagementInviteRole.Admin]: 'admin',
                [AppManagementInviteRole.Member]: 'member',
              }[item.role]) }}
            </ListItemBodyLeftLabel>
          </template>
          <template #bodyLeftSubtitle>
            <ListItemBodyLeftSubtitle>
              {{ item.subtitle }}
            </ListItemBodyLeftSubtitle>
          </template>
          <template #bodyRightRadio>
            <ListItemBodyRightRadio
              :haptic="false"
              :checked="role === item.role"
            />
          </template>
        </ListItem>
      </List>

      <List
        v-if="onRemove"
        class="list"
      >
        <ListItem
          :clickable="!lockControls"
          variant="destructive"
          @click="!lockControls && $emit('remove')"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ t('removeManager') }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
      </List>
    </PagePaddings>
  </Page>
</template>

<style scoped>
.list {
  margin-top: 16px;
}
</style>
