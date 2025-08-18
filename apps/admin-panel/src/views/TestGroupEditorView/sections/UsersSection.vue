<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightClear from '@/ui/adapters/ListItemBodyRightClear';
import type { SelectedUser } from '@/ui/components/UserSelectionView/UserSelectionView.vue';

const users = defineModel<SelectedUser[]>({ required: true });
defineProps<{
  readonly: boolean;
  disabled: boolean;
  platformNames: string[];
}>();
defineEmits<{ startSelecting: [] }>();

const { t } = useI18n({
  messages: {
    en: {
      usersTitle: 'Users',
      usersFooter: 'Opening your application in <b>{platforms}</b>, Platformer will use the test group URL for these users to display the application.',
      addUsers: 'Add users',
    },
    ru: {
      usersTitle: 'Пользователи',
      usersFooter: 'При открытии приложения в <b>{platforms}</b>, для показа выбранным пользователям, Платформер будет использовать ссылку тестовой группы.',
      addUsers: 'Добавить пользователей',
    },
  },
});

const onUserDeleted = (user: SelectedUser) => {
  users.value = users.value.filter(u => u.id !== user.id);
  hapticFeedbackSelectionChanged();
};
</script>

<template>
  <List :title="t('usersTitle')">
    <ListItem
      v-if="!readonly"
      :clickable="!disabled"
      variant="accent"
      @click="!disabled && $emit('startSelecting')"
    >
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>{{ t('addUsers') }}</ListItemBodyLeftLabel>
      </template>
    </ListItem>
    <ListItem
      v-for="user in users"
      :key="user.id"
    >
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>
          {{ user.name }} <span class="userId">#{{ user.id }}</span>
        </ListItemBodyLeftLabel>
      </template>
      <template
        v-if="!readonly"
        #bodyRightClear
      >
        <ListItemBodyRightClear @click="!disabled && onUserDeleted(user)" />
      </template>
    </ListItem>
    <template
      v-if="platformNames.length"
      #footer
    >
      <span v-html="t('usersFooter', { platforms: platformNames.join(', ') })" />
    </template>
  </List>
</template>

<style scoped>
.userId {
  color: var(--theme-subtitle-text-color);
}
</style>
