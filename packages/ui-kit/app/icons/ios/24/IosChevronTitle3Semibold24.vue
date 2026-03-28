<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronTitle3Semibold24Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 24 } = defineProps<IosChevronTitle3Semibold24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 24" :width="size" :height="size"><path fill="currentColor" d="M12.783 12.654q0 .264-.105.501a1.3 1.3 0 0 1-.317.44l-6.758 6.618a1.15 1.15 0 0 1-.835.334q-.317 0-.59-.158a1.26 1.26 0 0 1-.439-.422 1.14 1.14 0 0 1-.158-.598q0-.484.37-.861l6.02-5.854-6.02-5.853a1.18 1.18 0 0 1-.37-.862q0-.325.158-.588.167-.273.44-.431.272-.159.589-.158.492 0 .835.334l6.758 6.618q.211.21.317.44.105.228.105.5"/></svg>
</template>