<script setup lang="ts">
/* eslint-disable */
const { size = 28 } = defineProps<{
  size?: string | number;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M14.707 18.457a1 1 0 0 1-1.414 0l-7.5-7.5a1 1 0 0 1 1.414-1.414L14 16.336l6.793-6.793a1 1 0 1 1 1.414 1.414z" clip-rule="evenodd"/></svg>
</template>