<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Appearance30Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 30 } = defineProps<Appearance30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#32ade6" rx="8"/><path fill="#fff" d="M15 5c5.523 0 10 4.477 10 10s-4.477 10-10 10S5 20.523 5 15 9.477 5 15 5m0 18.34a8.34 8.34 0 1 0 0-16.68z"/></svg>
</template>