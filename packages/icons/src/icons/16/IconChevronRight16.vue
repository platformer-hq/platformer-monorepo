<script setup lang="ts">
/* eslint-disable */
export interface IconChevronRight16Props {
  size?: string | number;
}

const { size = 16 } = defineProps<IconChevronRight16Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" :width="size" :height="size"><path fill="currentColor" d="M11.856 7.992c0 .24-.083.44-.276.627l-4.512 4.412a.75.75 0 0 1-.55.229.793.793 0 0 1-.797-.791.8.8 0 0 1 .252-.574L9.98 7.986 5.973 4.09a.8.8 0 0 1-.252-.574c0-.44.357-.786.797-.786a.74.74 0 0 1 .55.223l4.512 4.412a.85.85 0 0 1 .275.627"/></svg>
</template>