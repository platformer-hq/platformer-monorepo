<script setup lang="ts">
/* eslint-disable */
export interface Dots24Props {
  class?: string;
  size?: string | number;
}

const { size = 24 } = defineProps<Dots24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :width="size" :height="size" :class="class"><path fill="currentColor" d="M12.522 8c1.148 0 2.087-.9 2.087-2s-.94-2-2.087-2-2.087.9-2.087 2 .939 2 2.087 2m0 2c-1.148 0-2.087.9-2.087 2s.939 2 2.087 2 2.087-.9 2.087-2-.94-2-2.087-2m0 6c-1.148 0-2.087.9-2.087 2s.939 2 2.087 2 2.087-.9 2.087-2-.94-2-2.087-2"/></svg>
</template>