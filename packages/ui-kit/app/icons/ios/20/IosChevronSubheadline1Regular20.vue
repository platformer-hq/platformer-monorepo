<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronSubheadline1Regular20Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<IosChevronSubheadline1Regular20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 20" :width="size" :height="size"><path fill="currentColor" d="M8.917 10.417a.5.5 0 0 1-.051.229.6.6 0 0 1-.134.19l-5.027 4.92a.57.57 0 0 1-.419.17.58.58 0 0 1-.501-.285.56.56 0 0 1-.077-.292q0-.235.166-.412l4.62-4.52-4.62-4.52a.6.6 0 0 1-.166-.412q0-.165.077-.292a.58.58 0 0 1 .501-.286q.248 0 .42.165l5.026 4.926q.09.09.134.197a.5.5 0 0 1 .05.222"/></svg>
</template>