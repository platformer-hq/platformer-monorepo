<script setup lang="ts">
/* eslint-disable */
export interface MinusCircleFill24Props {
  size?: string | number;
}

const { size = 24 } = defineProps<MinusCircleFill24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19m-4.286 8.75a.75.75 0 0 0 0 1.5h8.572a.75.75 0 0 0 0-1.5z" clip-rule="evenodd"/></svg>
</template>