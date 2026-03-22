<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronTitle1Semibold34Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 34 } = defineProps<IosChevronTitle1Semibold34Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 34" :width="size" :height="size"><path fill="currentColor" d="M17.21 18.54q0 .35-.14.667a1.8 1.8 0 0 1-.422.586l-9.011 8.824a1.54 1.54 0 0 1-1.114.445q-.421 0-.785-.21a1.7 1.7 0 0 1-.586-.563q-.21-.351-.21-.797 0-.645.492-1.148l8.027-7.805-8.027-7.805q-.493-.492-.493-1.148 0-.434.211-.785a1.65 1.65 0 0 1 .586-.574q.363-.211.785-.211.657 0 1.114.445l9.011 8.824q.282.282.422.586.14.305.14.668"/></svg>
</template>