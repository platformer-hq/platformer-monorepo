<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightSwitch from '@/ui/adapters/ListItemBodyRightSwitch';

const checked = defineModel<boolean>('checked', { required: true });

const { t } = useI18n({
  messages: {
    en: { title: 'Single URL' },
    ru: { title: 'Единая ссылка' },
  },
});
</script>

<template>
  <List>
    <ListItem>
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>
          {{ t('title') }}
        </ListItemBodyLeftLabel>
      </template>
      <template #bodyRightSwitch>
        <ListItemBodyRightSwitch
          :checked="checked"
          @change="$emit('update:checked', $event.target.checked)"
        />
      </template>
    </ListItem>
  </List>
</template>
