<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List.js';

import ListItem from './ListItem.vue';

const canBeInvitedToManage = defineModel<boolean>('canBeInvitedToManage', { required: true });
const canAcceptAppTransfers = defineModel<boolean>('canAcceptAppTransfers', { required: true });

const { t } = useI18n({
  messages: {
    en: {
      title: 'Invites and requests',
      invitesTitle: 'App management',
      invitesFooter: 'Allows other users to invite you to manager their applications.',
      transfersTitle: 'App transfers',
      transfersFooter: 'Allows other users to send you transfer requests related to their applications.',
    },
    ru: {
      title: 'Приглашения и запросы',
      invitesTitle: 'Управление приложениями',
      invitesFooter: 'Разрешает другим пользователям приглашать Вас к управлению их приложениями.',
      transfersTitle: 'Перенос приложений',
      transfersFooter: 'Разрешает другим пользователям отправлять Вам запросы на передачу их приложений.',
    },
  },
});
</script>

<template>
  <List
    class="privacy-view__list"
    :title="t('title')"
  >
    <ListItem
      v-model="canBeInvitedToManage"
      :title="t('invitesTitle')"
    />
    <template #footer>
      {{ t('invitesFooter') }}
    </template>
  </List>
  <List>
    <ListItem
      v-model="canAcceptAppTransfers"
      :title="t('transfersTitle')"
    />
    <template #footer>
      {{ t('transfersFooter') }}
    </template>
  </List>
</template>

<style>
.privacy-view__list {
  margin-bottom: 16px;
}
</style>
