<script setup lang="ts">
/* eslint-disable */
export interface ElipsisOutlineIOS28Props {
  class?: string;
  size?: string | number;
}

const { size = 28 } = defineProps<ElipsisOutlineIOS28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size" :class="class"><path fill="currentColor" fill-rule="evenodd" d="M8.995 13.995a2 2 0 1 1-4 0 2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m5 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4" clip-rule="evenodd"/></svg>
</template>