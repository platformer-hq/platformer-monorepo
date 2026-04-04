<script setup lang="ts">
/* eslint-disable */
export interface ChevronRight28Props {
  size?: string | number;
}

const { size = 28 } = defineProps<ChevronRight28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M19.207 13.293a1 1 0 0 1 0 1.414l-7.5 7.5a1 1 0 0 1-1.414-1.414L17.086 14l-6.793-6.793a1 1 0 1 1 1.414-1.414z" clip-rule="evenodd"/></svg>
</template>