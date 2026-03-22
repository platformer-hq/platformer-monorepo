<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface XMark40Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 40 } = defineProps<XMark40Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" :width="size" :height="size"><path fill="currentColor" d="M30.7 28.9c.474.475.474 1.27 0 1.758s-1.297.474-1.772 0L20 21.73l-8.929 8.928c-.474.474-1.283.474-1.772 0-.488-.474-.474-1.283 0-1.758l8.929-8.942-8.929-8.929c-.474-.474-.474-1.27 0-1.758.475-.502 1.298-.488 1.772 0L20 18.2l8.928-8.929a1.24 1.24 0 0 1 1.772 0c.488.475.474 1.284 0 1.758l-8.928 8.929z"/></svg>
</template>