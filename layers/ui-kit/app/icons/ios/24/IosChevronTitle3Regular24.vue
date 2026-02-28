<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronTitle3Regular24Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 24 } = defineProps<IosChevronTitle3Regular24Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 24" :width="size" :height="size"><path fill="currentColor" d="M12.423 12.654a.7.7 0 0 1-.07.317.9.9 0 0 1-.185.263l-6.961 6.812a.8.8 0 0 1-.58.237.8.8 0 0 1-.404-.105.77.77 0 0 1-.29-.29.77.77 0 0 1-.106-.405q0-.325.229-.57l6.398-6.259-6.398-6.258a.8.8 0 0 1-.229-.57.77.77 0 0 1 .106-.405.77.77 0 0 1 .29-.29.8.8 0 0 1 .404-.106q.342 0 .58.229l6.961 6.82a.8.8 0 0 1 .184.273q.07.14.07.307"/></svg>
</template>