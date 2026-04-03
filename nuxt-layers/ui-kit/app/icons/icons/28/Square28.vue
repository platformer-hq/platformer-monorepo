<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Square28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<Square28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" d="M8.077 22.99c-2.04 0-3.066-1.007-3.066-3.018V8.038c0-2.012 1.025-3.027 3.066-3.027h11.846c2.05 0 3.066 1.015 3.066 3.027v11.934c0 2.011-1.015 3.017-3.066 3.017zm.02-1.573h11.806c.967 0 1.514-.518 1.514-1.533V8.126c0-1.016-.547-1.543-1.514-1.543H8.097c-.977 0-1.514.527-1.514 1.543v11.758c0 1.015.537 1.533 1.514 1.533"/></svg>
</template>