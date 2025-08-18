<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Levels30Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 30 } = defineProps<Levels30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="currentColor" rx="7"/><path fill="#fff" fill-rule="evenodd" d="M10.5 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M24 14.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-10 6a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" clip-rule="evenodd"/></svg>
</template>