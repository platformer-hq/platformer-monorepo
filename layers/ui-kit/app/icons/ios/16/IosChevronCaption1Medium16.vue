<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronCaption1Medium16Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 16 } = defineProps<IosChevronCaption1Medium16Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 16" :width="size" :height="size"><path fill="currentColor" d="M7.13 8.475a.6.6 0 0 1-.049.234.7.7 0 0 1-.146.205l-3.804 3.72a.54.54 0 0 1-.4.167.56.56 0 0 1-.289-.078.55.55 0 0 1-.283-.489q0-.234.176-.415l3.428-3.344L2.335 5.13a.57.57 0 0 1-.103-.698.56.56 0 0 1 .21-.2.56.56 0 0 1 .288-.079q.24 0 .4.161l3.805 3.721a.7.7 0 0 1 .146.205.6.6 0 0 1 .049.235"/></svg>
</template>