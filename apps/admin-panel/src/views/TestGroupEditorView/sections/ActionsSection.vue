<script setup lang="ts">
import { showPopup } from '@telegram-apps/sdk-vue';
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';

defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ delete: [] }>();

const { t } = useI18n({
  messages: {
    en: {
      confirmDeleteTitle: 'Confirm deletion',
      confirmDeleteMessage: 'Are you sure you want to delete the test group?',
      confirmDeleteCancel: 'Cancel',
      confirmDeleteConfirm: 'Delete test group',
      label: 'Delete test group',
    },
    ru: {
      confirmDeleteTitle: 'Подтвердите удаление',
      confirmDeleteMessage: 'Вы уверены, что хотите удалить эту тестовую группу?',
      confirmDeleteCancel: 'Отмена',
      confirmDeleteConfirm: 'Удалить тестовую группу',
      label: 'Удалить тестовую группу',
    },
  },
});

const onDelete = async () => {
  if (await showPopup({
    title: t('confirmDeleteTitle'),
    message: t('confirmDeleteMessage'),
    buttons: [
      { id: 'no', type: 'default', text: t('confirmDeleteCancel') },
      { id: 'yes', type: 'destructive', text: t('confirmDeleteConfirm') },
    ],
  }) === 'yes') {
    emit('delete');
  }
};
</script>

<template>
  <List>
    <ListItem
      :clickable="!disabled"
      variant="destructive"
      @click="!disabled && onDelete()"
    >
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>{{ t('label') }}</ListItemBodyLeftLabel>
      </template>
    </ListItem>
  </List>
</template>
