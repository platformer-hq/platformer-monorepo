<script setup lang="ts">
/* eslint-disable */
export interface IconStories24Props {
  size?: string | number;
}

const { size = 24 } = defineProps<IconStories24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" d="M12.4 2c3.36 0 5.04 0 6.324.654a6 6 0 0 1 2.622 2.622C22 6.56 22 8.24 22 11.6v.8c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C17.44 22 15.76 22 12.4 22h-.8c-3.36 0-5.04 0-6.324-.654a6 6 0 0 1-2.622-2.622C2 17.44 2 15.76 2 12.4v-.8c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C6.56 2 8.24 2 11.6 2zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6"/></svg>
</template>