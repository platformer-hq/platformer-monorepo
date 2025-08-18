<script setup lang="ts">
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemLeftLabel from '@/ui/adapters/ListItemLeftLabel.js';

defineProps<{
  leftLabel: string;
  label: Maybe<string | number>;
}>();
</script>

<template>
  <ListItem>
    <template #leftLabel>
      <ListItemLeftLabel class="profile-view__item-label">
        {{ leftLabel }}
      </ListItemLeftLabel>
    </template>
    <template #bodyLeftLabel>
      <ListItemBodyLeftLabel>
        {{ label }}
      </ListItemBodyLeftLabel>
    </template>
  </ListItem>
</template>

<style>
.profile-view__item-label {
  width: 100px;
}
</style>
