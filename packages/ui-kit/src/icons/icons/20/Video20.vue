<script setup lang="ts">
/* eslint-disable */
export interface Video20Props {
  size?: string | number;
}

const { size = 20 } = defineProps<Video20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M3.723 16.552c-1.582 0-2.402-.813-2.402-2.373V5.258c0-1.568.82-2.373 2.402-2.373H16.27c1.582 0 2.402.813 2.402 2.373v8.92c0 1.56-.82 2.374-2.402 2.374zm.088-1.436h12.37c.674 0 1.055-.351 1.055-1.062V5.382c0-.71-.38-1.069-1.054-1.069H3.81c-.681 0-1.055.359-1.055 1.07v8.671c0 .71.374 1.062 1.055 1.062m4.9-2.534c-.396.234-.85.037-.85-.388V7.228c0-.425.476-.608.85-.388l4.072 2.41a.534.534 0 0 1 0 .93z"/></svg>
</template>