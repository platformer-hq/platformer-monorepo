<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Xmark28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<Xmark28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m6 6 16 16M6 22 22 6"/></svg>
</template>