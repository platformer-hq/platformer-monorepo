<script setup lang="ts">
/* eslint-disable */
export interface Twitter24Props {
  class?: string;
  size?: string | number;
}

const { size = 24 } = defineProps<Twitter24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size" :class="class"><path fill="currentColor" d="M17.217 3.865h2.76l-6.03 6.892 7.094 9.378h-5.555l-4.35-5.688-4.978 5.688H3.396l6.45-7.372L3.04 3.866h5.695l3.932 5.199zm-.97 14.618h1.53L7.905 5.43H6.264z"/></svg>
</template>