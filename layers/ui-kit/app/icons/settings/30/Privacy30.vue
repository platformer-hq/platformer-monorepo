<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Privacy30Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 30 } = defineProps<Privacy30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#8e8e93" rx="8"/><path fill="#fff" d="M15 4.17A5.83 5.83 0 0 1 20.83 10v3.444a4 4 0 0 1 1.865 2.025C23 16.204 23 17.136 23 19s0 2.795-.305 3.53a4 4 0 0 1-2.165 2.165C19.795 25 18.863 25 17 25h-4c-1.864 0-2.795 0-3.53-.305a4 4 0 0 1-2.165-2.165C7 21.795 7 20.864 7 19s0-2.796.305-3.531a4 4 0 0 1 1.865-2.025V10A5.83 5.83 0 0 1 15 4.17m0 1.66A4.17 4.17 0 0 0 10.83 10v3.037C11.385 13 12.08 13 13 13h4c.922 0 1.615 0 2.17.037V10A4.17 4.17 0 0 0 15 5.83"/></svg>
</template>