<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Pencil28Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 28 } = defineProps<Pencil28Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" :width="size" :height="size"><path fill="currentcolor" d="m20.4 9.358-1.728-1.72.986-.976c.498-.488 1.035-.527 1.474-.088l.332.332c.45.45.42.987-.078 1.485zM8.886 20.842l-2.256.869c-.234.098-.488-.176-.39-.41l.928-2.178L17.832 8.48l1.709 1.718z"/></svg>
</template>