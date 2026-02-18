<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface User20Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<User20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M10 9.514c-1.575 0-2.93-1.407-2.93-3.223 0-1.794 1.363-3.164 2.93-3.164s2.93 1.34 2.93 3.15c0 1.83-1.363 3.237-2.93 3.237m-4.915 6.782c-.783 0-1.252-.366-1.252-.974 0-1.89 2.366-4.497 6.16-4.497 3.8 0 6.167 2.607 6.167 4.497 0 .608-.47.974-1.253.974z"/></svg>
</template>