<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';

defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ delete: [] }>();

const { t } = useI18n({
  messages: {
    en: {
      'deletePopup.title': 'Confirm deletion',
      'deletePopup.message': 'Are you sure you want to delete the function?',
      'deletePopup.cancel': 'Cancel',
      'deletePopup.confirm': 'Delete function',
      'deleteButton.text': 'Delete function',
    },
    ru: {
      'deletePopup.title': 'Подтвердите удаление',
      'deletePopup.message': 'Вы уверены, что хотите удалить эту функцию?',
      'deletePopup.cancel': 'Отмена',
      'deletePopup.confirm': 'Удалить функцию',
      'deleteButton.text': 'Удалить функцию',
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
  <AutoSection style="margin-top: 16px" list-bg-color="section-bg">
    <AutoList>
      <AutoListItem
        :variant="disabled ? 'placeholder' : 'destructive'"
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
