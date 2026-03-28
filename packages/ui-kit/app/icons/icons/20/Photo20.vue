<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface Photo20Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<Photo20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M3.723 16.553c-1.582 0-2.403-.813-2.403-2.373V5.259c0-1.568.82-2.373 2.403-2.373h12.546c1.582 0 2.402.813 2.402 2.373v8.92c0 1.56-.82 2.374-2.402 2.374zm-.967-11.17v7.837l2.021-1.816c.308-.278.608-.41.945-.41.344 0 .681.146.989.417l1.355 1.223 3.303-2.959c.337-.293.696-.432 1.099-.432.388 0 .776.147 1.098.447l3.67 3.435V5.383c0-.71-.381-1.069-1.055-1.069H3.811c-.682 0-1.055.359-1.055 1.07m4.24 4.468A1.76 1.76 0 0 1 5.24 8.093c0-.96.783-1.758 1.758-1.758.96 0 1.75.799 1.75 1.758a1.76 1.76 0 0 1-1.75 1.758"/></svg>
</template>