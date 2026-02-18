<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface SysIosChevronFootnoteRegular18Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 18 } = defineProps<SysIosChevronFootnoteRegular18Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 18" :width="size" :height="size"><path fill="currentColor" d="M7.314 10.122a.45.45 0 0 1-.043.193.5.5 0 0 1-.113.162l-4.254 4.162a.48.48 0 0 1-.354.145.49.49 0 0 1-.425-.242.47.47 0 0 1-.064-.247q0-.198.14-.349l3.91-3.824L2.2 6.298a.5.5 0 0 1-.14-.35.47.47 0 0 1 .064-.246.49.49 0 0 1 .424-.242q.21 0 .355.14l4.254 4.168q.075.075.113.166.043.086.043.188"/></svg>
</template>