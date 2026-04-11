<script setup lang="ts">
/* eslint-disable */
export interface IconArrowUp24Props {
  size?: string | number;
}

const { size = 24 } = defineProps<IconArrowUp24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" d="M6.447 11.431c-.498 0-.872-.382-.872-.888a.92.92 0 0 1 .282-.656l5.47-5.478a.96.96 0 0 1 .673-.29c.249 0 .49.107.672.29l5.47 5.478c.192.2.283.415.283.656 0 .506-.365.888-.864.888a.94.94 0 0 1-.647-.265l-1.884-1.86-2.192-2.449.067 1.793v10.31c0 .548-.365.921-.905.921-.531 0-.905-.373-.905-.921V8.65l.067-1.8L8.97 9.305l-1.884 1.86a.92.92 0 0 1-.64.265"/></svg>
</template>