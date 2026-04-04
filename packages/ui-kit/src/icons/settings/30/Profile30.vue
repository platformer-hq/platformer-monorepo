<script setup lang="ts">
/* eslint-disable */
export interface Profile30Props {
  size?: string | number;
}

const { size = 30 } = defineProps<Profile30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#ff2d55" rx="8"/><path fill="#fff" d="M15 5c5.523 0 10 4.477 10 10s-4.477 10-10 10S5 20.523 5 15 9.477 5 15 5m0 13.077q-3.47 0-5.385 1.634c-.128.11-.29.277-.44.442a.72.72 0 0 0 .037 1.006 8 8 0 0 0 .406.371A8.43 8.43 0 0 0 15 23.462a8.43 8.43 0 0 0 5.385-1.936 8 8 0 0 0 .403-.367.72.72 0 0 0 .037-1.005 6 6 0 0 0-.438-.44Q18.473 18.077 15 18.077m0-8.462a3.077 3.077 0 1 0 0 6.155 3.077 3.077 0 0 0 0-6.155"/></svg>
</template>