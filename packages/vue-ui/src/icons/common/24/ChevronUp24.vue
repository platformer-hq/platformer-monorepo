<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ChevronUp24Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 24 } = defineProps<ChevronUp24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="#222" fill-rule="evenodd" d="M11.176 7.176a1.165 1.165 0 0 1 1.648 0l7.5 7.5a1.165 1.165 0 1 1-1.648 1.648L12 9.648l-6.676 6.676a1.165 1.165 0 1 1-1.648-1.648z" clip-rule="evenodd"/></svg>
</template>