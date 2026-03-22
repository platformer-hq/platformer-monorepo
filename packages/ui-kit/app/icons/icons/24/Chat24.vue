<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Chat24Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 24 } = defineProps<Chat24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" d="M7.858 21.081c-.498 0-.789-.349-.789-.896v-2.391h-.523c-2.407 0-3.843-1.428-3.843-3.893V7.459c0-2.465 1.403-3.893 3.901-3.893h10.8c2.49 0 3.893 1.428 3.893 3.893v6.442c0 2.465-1.403 3.893-3.893 3.893h-5.487L8.879 20.54c-.415.374-.672.54-1.021.54"/></svg>
</template>