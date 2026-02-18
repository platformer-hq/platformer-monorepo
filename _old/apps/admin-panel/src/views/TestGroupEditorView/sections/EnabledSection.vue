<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightSwitch from '@/ui/adapters/ListItemBodyRightSwitch';

const checked = defineModel<boolean>({ required: true });
defineProps<{ disabled: boolean }>();

const { t } = useI18n({
  messages: {
    en: { title: 'Enabled' },
    ru: { title: 'Включена' },
  },
});
</script>

<template>
  <List>
    <ListItem>
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>{{ t('title') }}</ListItemBodyLeftLabel>
      </template>
      <template #bodyRightSwitch>
        <ListItemBodyRightSwitch
          :disabled="disabled"
          :checked="checked"
          @change="checked = $event.target.checked"
        />
      </template>
    </ListItem>
  </List>
</template>
