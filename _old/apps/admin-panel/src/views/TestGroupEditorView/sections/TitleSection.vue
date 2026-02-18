<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput';

const value = defineModel<string>({ required: true });
defineProps<{ disabled: boolean }>();

const { t } = useI18n({
  messages: {
    en: {
      title: 'Title',
      footer: 'Test group display name. It will only be visible to the application managers.',
      placeholder: 'optional',
    },
    ru: {
      title: 'Заголовок',
      footer: 'Отображаемое имя тестовой группы. Оно будет видно только менеджерам приложения.',
      placeholder: 'опционально',
    },
  },
});
</script>

<template>
  <List
    :title="t('title')"
    :footer="t('footer')"
  >
    <ListItem>
      <template #bodyInput>
        <ListItemBodyInput
          v-model:value="value"
          :disabled="disabled"
          :placeholder="t('placeholder')"
          :clear="!disabled"
        />
      </template>
    </ListItem>
  </List>
</template>
