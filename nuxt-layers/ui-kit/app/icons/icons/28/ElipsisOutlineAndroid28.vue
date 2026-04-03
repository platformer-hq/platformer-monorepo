<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ElipsisOutlineAndroid28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<ElipsisOutlineAndroid28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M16 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0m0 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-2 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4" clip-rule="evenodd"/></svg>
</template>