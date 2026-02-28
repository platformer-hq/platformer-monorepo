<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronTitle3Medium24Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 24 } = defineProps<IosChevronTitle3Medium24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 24" :width="size" :height="size"><path fill="currentColor" d="M12.634 12.654q0 .229-.088.422a1.3 1.3 0 0 1-.264.37l-6.846 6.697a.96.96 0 0 1-.721.298 1 1 0 0 1-.519-.14 1 1 0 0 1-.378-.37 1.04 1.04 0 0 1 .185-1.257l6.17-6.02-6.17-6.02a1.03 1.03 0 0 1-.316-.738q0-.291.131-.519.141-.229.378-.36a1 1 0 0 1 .519-.141q.43 0 .72.29l6.847 6.697q.175.175.264.37.088.193.088.421"/></svg>
</template>