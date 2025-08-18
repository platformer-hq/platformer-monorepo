<script setup lang="ts">
import type { Component } from 'vue';
import { useRouter } from 'vue-router';

import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyRightChevron from '@/ui/adapters/ListItemBodyRightChevron';
import ListItemBodyRightCounter from '@/ui/adapters/ListItemBodyRightCounter';
import ListItemLeftIcon from '@/ui/adapters/ListItemLeftIcon.js';
import ListItemIcon from '@/ui/components/ListItemIcon.vue';

defineProps<{
  color: string;
  count?: number;
  path: string;
  icon: Component<{ class?: string }>;
  loading?: boolean;
  title: string;
}>();

const router = useRouter();
</script>

<template>
  <ListItem
    clickable
    @click="router.push(path)"
  >
    <template #leftIcon>
      <ListItemLeftIcon rounded>
        <ListItemIcon
          :is="icon"
          :color="color.startsWith('#') ? color : `var(--theme-${color}-color)`"
        />
      </ListItemLeftIcon>
    </template>
    <template #bodyLeftLabel>
      <ListItemBodyLeftLabel>
        {{ title }}
      </ListItemBodyLeftLabel>
    </template>
    <template
      v-if="count"
      #bodyRightCounter
    >
      <ListItemBodyRightCounter>
        {{ count }}
      </ListItemBodyRightCounter>
    </template>
    <template
      v-if="count"
      #bodyRightChevron
    >
      <ListItemBodyRightChevron />
    </template>
  </ListItem>
</template>
