<script setup lang="ts">
import type { Component } from 'vue';

const { is } = defineProps<{
  is: Component<{ class?: string; color?: string }> | 'svg';
  color?: string;
}>();
</script>

<template>
  <component
    :is="is"
    class="list-item-icon"
    :color="color"
  />
</template>

<style>
.list-item-icon {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
