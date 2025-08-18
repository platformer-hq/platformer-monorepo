<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ArrowDown28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<ArrowDown28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M14.707 23.707a1 1 0 0 1-1.414 0l-7.5-7.5a1 1 0 1 1 1.414-1.414L13 20.586V5a1 1 0 1 1 2 0v15.586l5.793-5.793a1 1 0 0 1 1.414 1.414z" clip-rule="evenodd"/></svg>
</template>