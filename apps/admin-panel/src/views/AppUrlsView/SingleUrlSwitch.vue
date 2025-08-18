<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyRightSwitch from '@/ui/adapters/ListItemBodyRightSwitch';
import ListItemLeftLabel from '@/ui/adapters/ListItemLeftLabel';

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
      <template #leftLabel>
        <ListItemLeftLabel>
          {{ t('title') }}
        </ListItemLeftLabel>
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
