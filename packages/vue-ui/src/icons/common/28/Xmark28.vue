<script setup lang="ts">
/* eslint-disable */
export interface Xmark28Props {
  class?: string;
  size?: string | number;
}

const { size = 28 } = defineProps<Xmark28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size" :class="class"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m6 6 16 16M6 22 22 6"/></svg>
</template>