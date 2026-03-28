<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronSubheadline2Medium18Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 18 } = defineProps<IosChevronSubheadline2Medium18Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 9 18" :width="size" :height="size"><path fill="currentColor" d="M8.256 9.77q0 .152-.059.28a.9.9 0 0 1-.176.247l-4.564 4.465a.64.64 0 0 1-.48.199.67.67 0 0 1-.346-.094.66.66 0 0 1-.34-.586q0-.28.21-.498L6.616 9.77 2.502 5.756a.7.7 0 0 1-.211-.492.7.7 0 0 1 .088-.346.7.7 0 0 1 .252-.24.67.67 0 0 1 .346-.094q.287 0 .48.193l4.564 4.465q.118.117.176.246.06.129.059.282"/></svg>
</template>