<script setup lang="ts">
/* eslint-disable */
export interface VersionAndNetwork30Props {
  size?: string | number;
}

const { size = 30 } = defineProps<VersionAndNetwork30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#8e8e93" rx="8"/><path fill="#fff" d="M7.587 16.478c-1.299.767-.208 2.748 1.235 1.853l4.747-4.022c.947-.591.899-1.997 0-2.573L8.822 7.73c-1.443-.895-2.55 1.055-1.235 1.853l3.978 3.432zm5.926 3.922c0 .591.465 1.07 1.059 1.07h7.353c.61 0 1.075-.479 1.075-1.07s-.465-1.07-1.075-1.07h-7.353c-.594 0-1.059.479-1.059 1.07"/></svg>
</template>