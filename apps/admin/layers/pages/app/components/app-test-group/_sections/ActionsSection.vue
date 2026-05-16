<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';

defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ delete: [] }>();

const { t } = useI18n({
  messages: {
    en: {
      'deletePopup.title': 'Confirm deletion',
      'deletePopup.message': 'Are you sure you want to delete the test group?',
      'deletePopup.cancel': 'Cancel',
      'deletePopup.confirm': 'Delete test group',
      'deleteButton.text': 'Delete test group',
    },
    ru: {
      'deletePopup.title': 'Подтвердите удаление',
      'deletePopup.message': 'Вы уверены, что хотите удалить эту тестовую группу?',
      'deletePopup.cancel': 'Отмена',
      'deletePopup.confirm': 'Удалить тестовую группу',
      'deleteButton.text': 'Удалить тестовую группу',
    },
  },
});

const handleDelete = async () => {
  if (await popup.show({
    title: t('deletePopup.title'),
    message: t('deletePopup.message'),
    buttons: [
      { id: 'no', type: 'default', text: t('deletePopup.cancel') },
      { id: 'yes', type: 'destructive', text: t('deletePopup.confirm') },
    ],
  }) === 'yes') {
    emit('delete');
  }
};
</script>

<template>
  <AutoSection
    list-bg-color="destructive-opaque-bg"
    style="margin-top: 16px"
  >
    <AutoList>
      <AutoListItem
        variant="destructive"
        :clickable="!disabled"
        @click="!disabled && handleDelete()"
      >
        <template #bodyLeftLabel>
          <AutoListItemBodyLeftLabel>
            {{ t('deleteButton.text') }}
          </AutoListItemBodyLeftLabel>
        </template>
      </AutoListItem>
    </AutoList>
  </AutoSection>
</template>
