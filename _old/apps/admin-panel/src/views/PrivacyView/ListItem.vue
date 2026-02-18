<script setup lang="ts">
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyRightSwitch from '@/ui/adapters/ListItemBodyRightSwitch';

const checked = defineModel<boolean>({ required: true });

defineProps<{ title: string }>();
</script>

<template>
  <ListItem>
    <template #bodyLeftLabel>
      <ListItemBodyLeftLabel>
        {{ title }}
      </ListItemBodyLeftLabel>
    </template>
    <template #bodyRightSwitch>
      <ListItemBodyRightSwitch
        :checked="checked"
        @change="checked = $event.target.checked"
      />
    </template>
  </ListItem>
</template>
