<script setup lang="ts">
/* eslint-disable */
export interface Move28Props {
  size?: string | number;
}

const { size = 28 } = defineProps<Move28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" d="m3.873 20.67 1.65-3.72c.352-.82 1.104-.986 1.563-.186l.947 1.641 5.186-2.607V9.45h-1.631c-.938 0-1.162-.742-.625-1.465l2.392-3.271c.41-.557.86-.547 1.27 0l2.402 3.271c.537.733.332 1.465-.625 1.465h-1.611v6.348l5.185 2.607.948-1.64c.459-.801 1.2-.635 1.562.185l1.64 3.72c.274.626.03 1.026-.634 1.104l-4.043.44c-.889.107-1.426-.45-.947-1.27l.693-1.191L14 17.145l-5.186 2.608.684 1.191c.478.82-.049 1.377-.947 1.27l-4.043-.44c-.664-.078-.909-.478-.635-1.103"/></svg>
</template>