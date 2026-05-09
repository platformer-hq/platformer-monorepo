<script setup lang="ts">
/* eslint-disable */
export interface IconRectanglePortrait40Props {
  size?: string | number;
}

const { size = 40 } = defineProps<IconRectanglePortrait40Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40" :width="size" :height="size"><path fill="currentColor" d="M8.267 30.589V9.426c0-2.902 1.437-4.381 4.325-4.381h14.816c2.888 0 4.325 1.479 4.325 4.38V30.59c0 2.916-1.437 4.367-4.325 4.367H12.592c-2.888 0-4.325-1.451-4.325-4.367m2.246-.042c0 1.395.74 2.162 2.19 2.162h14.593c1.451 0 2.19-.767 2.19-2.162V9.467c0-1.395-.739-2.176-2.19-2.176H12.704c-1.451 0-2.19.781-2.19 2.176z"/></svg>
</template>