<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronCaption1Regular16Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 16 } = defineProps<IosChevronCaption1Regular16Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 16" :width="size" :height="size"><path fill="currentColor" d="M7.013 8.475q0 .092-.04.175a.5.5 0 0 1-.102.147L3.004 12.58a.44.44 0 0 1-.322.132.44.44 0 0 1-.386-.22.43.43 0 0 1-.059-.224q0-.18.127-.318L5.92 8.475 2.364 4.998a.45.45 0 0 1-.127-.317q0-.127.059-.225a.45.45 0 0 1 .386-.22q.19 0 .322.127l3.867 3.79q.069.068.103.15.039.08.039.172"/></svg>
</template>