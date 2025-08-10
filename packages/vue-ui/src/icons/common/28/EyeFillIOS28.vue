<script setup lang="ts">
/* eslint-disable */
export interface EyeFillIOS28Props {
  size?: string | number;
}

const { size = 28 } = defineProps<EyeFillIOS28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M2.5 14s4-8 11.5-8 11.5 8 11.5 8-4 8-11.5 8-11.5-8-11.5-8M19 14a5 5 0 1 1-10 0 5 5 0 0 1 10 0m-2 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0" clip-rule="evenodd"/></svg>
</template>