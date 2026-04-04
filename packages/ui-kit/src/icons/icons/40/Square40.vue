<script setup lang="ts">
/* eslint-disable */
export interface Square40Props {
  size?: string | number;
}

const { size = 40 } = defineProps<Square40Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" :width="size" :height="size"><path fill="currentColor" d="M11.539 32.842c-2.916 0-4.38-1.437-4.38-4.311V11.483c0-2.874 1.464-4.325 4.38-4.325H28.46c2.93 0 4.38 1.451 4.38 4.325v17.048c0 2.874-1.45 4.31-4.38 4.31zm.028-2.246h16.866c1.381 0 2.163-.74 2.163-2.19V11.608c0-1.451-.782-2.205-2.163-2.205H11.567c-1.395 0-2.163.754-2.163 2.204v16.797c0 1.451.768 2.19 2.163 2.19"/></svg>
</template>