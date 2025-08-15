<script setup lang="ts">
/* eslint-disable */
export interface CheckmarkIOS28Props {
  class?: string;
  size?: string | number;
}

const { size = 28 } = defineProps<CheckmarkIOS28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 28" :width="size" :height="size" :class="class"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.33" d="m1.5 15.5 4.332 5.294c.083.102.24.093.311-.018L14 8.5"/></svg>
</template>