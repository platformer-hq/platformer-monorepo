<script setup lang="ts">
/* eslint-disable */
export interface IosChevronMedium22Props {
  size?: string | number;
}

const { size = 22 } = defineProps<IosChevronMedium22Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 22" :width="size" :height="size"><path fill="currentColor" d="M10.695 11.712a.8.8 0 0 1-.073.351q-.075.162-.22.308l-5.706 5.581a.8.8 0 0 1-.6.25q-.235 0-.432-.118a.83.83 0 0 1-.315-.308.87.87 0 0 1 .154-1.047l5.141-5.017-5.142-5.017a.86.86 0 0 1-.263-.615q0-.243.11-.433a.85.85 0 0 1 .315-.3.83.83 0 0 1 .432-.117q.36 0 .6.242l5.706 5.58q.146.146.22.308a.8.8 0 0 1 .073.352"/></svg>
</template>