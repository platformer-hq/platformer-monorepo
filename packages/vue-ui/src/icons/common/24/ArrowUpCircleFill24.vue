<script setup lang="ts">
/* eslint-disable */
export interface ArrowUpCircleFill24Props {
  size?: string | number;
}

const { size = 24 } = defineProps<ArrowUpCircleFill24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19m.53 4.684a.75.75 0 0 0-1.06 0l-3.43 3.429a.75.75 0 0 0 1.06 1.06l2.15-2.148v6.76a.75.75 0 0 0 1.5 0v-6.76l2.147 2.148a.75.75 0 1 0 1.061-1.06z" clip-rule="evenodd"/></svg>
</template>