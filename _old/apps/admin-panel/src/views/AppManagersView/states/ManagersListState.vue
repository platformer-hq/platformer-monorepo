<script setup lang="ts">
import { showPopup } from '@telegram-apps/sdk-vue';
import { AppManagementInviteRole, AppRole } from 'schema';
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRightClear from '@/ui/adapters/ListItemBodyRightClear';
import Page from '@/ui/components/Page.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

interface Invite {
  id: number;
  from: { name: string };
  to: { name: string };
  role: AppManagementInviteRole;
}

const props = defineProps<{
  invites: Invite[];
  managers: {
    user: { name: string; id: number };
    role: AppRole;
  }[];
  readonly: boolean;
  loading: boolean;
}>();
const emit = defineEmits<{
  inviteClick: [];
  revokeInvite: [{ inviteID: number }];
  managerClick: [{
    id: number;
    name: string;
    role: AppRole;
  }];
}>();

const { t } = useI18n({
  messages: {
    en: {
      managersTitle: 'Application managers',
      managersFooter: 'Each manager has a specific role that defines their permissions for application management. To assign someone as a manager, you need to send them an invitation, which they must accept.',
      invite: 'Invite to manage',
      invitesTitle: 'Management invites',
      invitesFooter: 'List of pending management invites that should be accepted by the invitees.',
      inviteFrom: 'From {name} / Role: {role}',
      confirmRevokeTitle: 'Confirm revoke',
      confirmRevokeMessage: 'Are you sure you want to revoke management invite sent to {name}?',
      confirmRevokeCancel: 'Cancel',
      confirmRevokeConfirm: 'Revoke invite',
      admin: 'Admin',
      owner: 'Owner',
      member: 'Member',
    },
    ru: {
      managersTitle: 'Менеджеры приложения',
      managersFooter: 'У каждого менеджера есть конкретная роль, которая определяет его уровень доступа в приложении. Чтобы назначить кого-либо менеджером, необходимо отправить ему приглашение на управление.',
      invite: 'Пригласить на управление',
      invitesTitle: 'Приглашения на управление',
      invitesFooter: 'Список активных приглашений на управление.',
      inviteFrom: 'От {name} / Роль: {role}',
      confirmRevokeTitle: 'Подтвердите отзыв',
      confirmRevokeMessage: 'Вы уверены, что хотите отозвать приглашение на управление {name}?',
      confirmRevokeCancel: 'Отмена',
      confirmRevokeConfirm: 'Отозвать приглашение',
      admin: 'Администратор',
      owner: 'Владелец',
      member: 'Участник',
    },
  },
});

const onRevoke = async (invite: Invite) => {
  if (!props.readonly && await showPopup({
    title: t('confirmRevokeTitle'),
    message: t('confirmRevokeMessage', invite.to.name),
    buttons: [
      { id: 'no', type: 'default', text: t('confirmRevokeCancel') },
      { id: 'yes', type: 'destructive', text: t('confirmRevokeConfirm') },
    ],
  }) === 'yes') {
    emit('revokeInvite', { inviteID: invite.id });
  }
};
</script>

<template>
  <Page>
    <PagePaddings>
      <List :title="t('managersTitle')">
        <ListItem
          :clickable="!readonly"
          :variant="readonly ? 'placeholder' : 'accent'"
          @click="!readonly && $emit('inviteClick')"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ t('invite') }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
        <ListItem
          v-for="manager in managers"
          :key="manager.user.id"
          large
          :clickable="manager.role !== AppRole.Owner && !loading && !readonly"
          @click="manager.role !== AppRole.Owner
            && !loading
            && !readonly
            && $emit('managerClick', {...manager.user, role: manager.role})"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ manager.user.name }}
            </ListItemBodyLeftLabel>
          </template>
          <template #bodyLeftSubtitle>
            <ListItemBodyLeftSubtitle>
              {{ t({
                [AppRole.Owner]: 'owner',
                [AppRole.Admin]: 'admin',
                [AppRole.Member]: 'member',
              }[manager.role]) }}
            </ListItemBodyLeftSubtitle>
          </template>
        </ListItem>
        <template #footer>
          {{ t('managersFooter') }}
        </template>
      </List>

      <List
        v-if="invites.length"
        :title="t('invitesTitle')"
        class="list"
      >
        <ListItem
          v-for="invite in invites"
          :key="invite.id"
          large
          :variant="loading ? 'placeholder' : 'regular'"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ invite.to.name }}
            </ListItemBodyLeftLabel>
          </template>
          <template #bodyLeftSubtitle>
            <ListItemBodyLeftSubtitle>
              {{ t('inviteFrom', {
                name: invite.from.name,
                role: t({
                  [AppManagementInviteRole.Admin]: 'admin',
                  [AppManagementInviteRole.Member]: 'member'
                }[invite.role])
              }) }}
            </ListItemBodyLeftSubtitle>
          </template>
          <template
            v-if="!readonly"
            #bodyRightClear
          >
            <ListItemBodyRightClear @click="onRevoke(invite)" />
          </template>
        </ListItem>
        <template #footer>
          {{ t('invitesFooter') }}
        </template>
      </List>
    </PagePaddings>
  </Page>
</template>

<style scoped>
.list {
  margin-top: 16px;
}
</style>
