<script setup lang="ts">
/* eslint-disable */
export interface IconBulb20Props {
  size?: string | number;
}

const { size = 20 } = defineProps<IconBulb20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M4.77 10.791q0 .225.146.371.157.135.382.135h3.937l-2.103 5.636q-.147.371.01.607.17.237.462.248.292 0 .529-.304l6.355-7.975q.192-.225.191-.45a.48.48 0 0 0-.157-.371.5.5 0 0 0-.371-.147h-3.937l2.103-5.635q.146-.37-.022-.596a.51.51 0 0 0-.45-.236q-.282-.011-.529.292l-6.355 7.975a.67.67 0 0 0-.191.45"/></svg>
</template>