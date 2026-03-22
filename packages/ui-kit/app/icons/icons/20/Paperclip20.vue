<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Paperclip20Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<Paperclip20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M14.922 10.305c.256-.242.659-.278.9-.022.25.242.257.689.008.93l-5.442 5.442c-1.853 1.846-4.52 1.714-6.204.037-1.684-1.685-1.809-4.344.044-6.196l7.434-7.45c1.421-1.413 3.31-1.325 4.527-.116 1.237 1.245 1.289 3.105-.125 4.519l-7.288 7.287c-.79.791-1.933.806-2.688.051-.695-.695-.725-1.897.052-2.687l5.083-5.076c.256-.257.63-.264.879-.03.241.25.227.623-.03.88L7.02 12.926c-.33.337-.235.718-.015.952.227.22.615.315.945-.014l7.25-7.259c.807-.813.953-2.006.162-2.797-.784-.792-1.992-.645-2.798.16l-7.39 7.39c-1.384 1.385-1.252 3.223-.059 4.41 1.18 1.187 3.025 1.326 4.402-.059z"/></svg>
</template>