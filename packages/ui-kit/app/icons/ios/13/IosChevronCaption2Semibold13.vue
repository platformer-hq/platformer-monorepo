<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronCaption2Semibold13Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 13 } = defineProps<IosChevronCaption2Semibold13Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 13" :width="size" :height="size"><path fill="currentColor" d="M7.213 6.475q0 .146-.059.278a.8.8 0 0 1-.175.244l-3.755 3.677a.64.64 0 0 1-.464.185.64.64 0 0 1-.327-.088.7.7 0 0 1-.245-.234.67.67 0 0 1 .117-.81L5.65 6.475 2.306 3.223A.656.656 0 0 1 2.76 2.09a.64.64 0 0 1 .464.185l3.755 3.677q.117.118.175.244.06.127.059.279"/></svg>
</template>