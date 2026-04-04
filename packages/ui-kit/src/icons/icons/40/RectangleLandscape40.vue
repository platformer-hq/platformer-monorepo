<script setup lang="ts">
/* eslint-disable */
export interface RectangleLandscape40Props {
  size?: string | number;
}

const { size = 40 } = defineProps<RectangleLandscape40Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" :width="size" :height="size"><path fill="currentColor" d="M7.932 32.842c-2.915 0-4.38-1.437-4.38-4.311V11.483c0-2.874 1.465-4.325 4.38-4.325h24.135c2.93 0 4.381 1.451 4.381 4.325v17.048c0 2.874-1.45 4.31-4.38 4.31zm.028-2.246h24.08c1.38 0 2.162-.74 2.162-2.19V11.608c0-1.451-.781-2.205-2.163-2.205H7.96c-1.395 0-2.162.754-2.162 2.204v16.797c0 1.451.767 2.19 2.162 2.19"/></svg>
</template>