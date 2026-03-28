<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ArrowUpRight28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<ArrowUpRight28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M9.5 7a1 1 0 0 1 1-1H21a1 1 0 0 1 1 1v10.5a1 1 0 1 1-2 0V9.414L7.707 21.707a1 1 0 0 1-1.414-1.414L18.586 8H10.5a1 1 0 0 1-1-1" clip-rule="evenodd"/></svg>
</template>