<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface SysIosChevronSubheadline1Semibold20Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<SysIosChevronSubheadline1Semibold20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 20" :width="size" :height="size"><path fill="currentColor" d="M9.177 10.417a.9.9 0 0 1-.076.362 1 1 0 0 1-.229.317l-4.881 4.78a.83.83 0 0 1-.603.241.83.83 0 0 1-.426-.114.9.9 0 0 1-.317-.305.87.87 0 0 1 .152-1.054l4.349-4.227-4.349-4.228a.853.853 0 0 1 .59-1.472q.357 0 .604.241l4.881 4.78q.153.152.229.317t.076.362"/></svg>
</template>