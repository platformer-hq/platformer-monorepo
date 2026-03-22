<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronCalloutSemibold22Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 22 } = defineProps<IosChevronCalloutSemibold22Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 22" :width="size" :height="size"><path fill="currentColor" d="M9.998 12.065a.95.95 0 0 1-.082.39q-.075.178-.246.34l-5.257 5.148a.9.9 0 0 1-.65.26.9.9 0 0 1-.457-.123 1 1 0 0 1-.342-.328.93.93 0 0 1 .164-1.135l4.683-4.552-4.683-4.553a.92.92 0 0 1-.164-1.128.96.96 0 0 1 .342-.335.9.9 0 0 1 .458-.123q.382 0 .65.26l5.256 5.147q.164.164.246.342a.9.9 0 0 1 .082.39"/></svg>
</template>