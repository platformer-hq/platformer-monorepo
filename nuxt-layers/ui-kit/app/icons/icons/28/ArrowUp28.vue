<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ArrowUp28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<ArrowUp28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M13.293 4.293a1 1 0 0 1 1.414 0l7.5 7.5a1 1 0 0 1-1.414 1.414L15 7.414V23a1 1 0 1 1-2 0V7.414l-5.793 5.793a1 1 0 0 1-1.414-1.414z" clip-rule="evenodd"/></svg>
</template>