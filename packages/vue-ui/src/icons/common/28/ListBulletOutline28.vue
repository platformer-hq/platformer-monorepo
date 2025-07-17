<script setup lang="ts">
const { size = 28 } = defineProps<{
  size?: string | number;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M4 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3.75-1.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5zm0 5a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5zM7 19a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H7.75A.75.75 0 0 1 7 19m-2-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2" clip-rule="evenodd"/></svg>
</template>