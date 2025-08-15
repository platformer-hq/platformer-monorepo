<script setup lang="ts">
/* eslint-disable */
export interface PlusCircleFill28Props {
  class?: string;
  size?: string | number;
}

const { size = 28 } = defineProps<PlusCircleFill28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size" :class="class"><path fill="currentColor" fill-rule="evenodd" d="M3 14C3 7.925 7.925 3 14 3s11 4.925 11 11-4.925 11-11 11S3 20.075 3 14m11-5.8a.8.8 0 0 1 .8.8v4.2H19a.8.8 0 0 1 0 1.6h-4.2V19a.8.8 0 0 1-1.6 0v-4.2H9a.8.8 0 0 1 0-1.6h4.2V9a.8.8 0 0 1 .8-.8" clip-rule="evenodd"/></svg>
</template>