<script setup lang="ts">
const { size = 24 } = defineProps<{
  size?: string | number;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0m9.501-6.75a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1 0-1.5h3.751V6a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>
</template>