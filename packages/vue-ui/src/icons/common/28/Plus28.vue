<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Plus28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<Plus28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M14 24a1 1 0 0 1-1-1v-8H5a1 1 0 1 1 0-2h8V5a1 1 0 1 1 2 0v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 0 1-1 1" clip-rule="evenodd"/></svg>
</template>