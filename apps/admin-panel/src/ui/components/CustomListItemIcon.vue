<script setup lang="ts">
import type { Component } from 'vue';

export interface CustomListItemIconProps {
  icon: Component<{ class?: string; size?: number | string }>;
  containerSize?: number | string;
  iconSize: number;
  background?: string;
}

defineProps<CustomListItemIconProps>();

function formatSize(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}
</script>

<template>
  <i
    class="custom-list-item-icon"
    :style="{
      background,
      ...containerSize ? {
        width: formatSize(containerSize),
        height: formatSize(containerSize),
      } : undefined,
    }"
  >
    <component
      :is="icon"
      :size="iconSize"
    />
  </i>
</template>

<style>
.custom-list-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
