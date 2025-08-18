<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Xmark24Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 24 } = defineProps<Xmark24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" d="M18.295 7.115a.997.997 0 1 0-1.41-1.41L12 10.59 7.115 5.705a.997.997 0 0 0-1.41 1.41L10.59 12l-4.885 4.885a.997.997 0 0 0 1.41 1.41L12 13.41l4.885 4.885a.997.997 0 1 0 1.41-1.41L13.41 12z"/></svg>
</template>