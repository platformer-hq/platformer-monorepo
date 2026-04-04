<script setup lang="ts">
/* eslint-disable */
export interface Passcode30Props {
  size?: string | number;
}

const { size = 30 } = defineProps<Passcode30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#007aff" rx="8"/><path fill="#fff" fill-rule="evenodd" d="M14.923 5.5a4.154 4.154 0 0 0-4.154 4.154v2.598c-.77.009-1.223.048-1.588.234a2.16 2.16 0 0 0-.945.945C8 13.894 8 14.5 8 15.711v4.327c0 1.212 0 1.818.236 2.28.207.408.538.739.945.946.463.236 1.069.236 2.28.236h6.924c1.211 0 1.817 0 2.28-.236.407-.207.738-.538.945-.945.236-.463.236-1.069.236-2.28V15.71c0-1.211 0-1.817-.236-2.28a2.16 2.16 0 0 0-.945-.945c-.365-.186-.819-.225-1.588-.234V9.654A4.154 4.154 0 0 0 14.923 5.5m2.77 6.75V9.654a2.77 2.77 0 1 0-5.54 0v2.596z" clip-rule="evenodd"/></svg>
</template>