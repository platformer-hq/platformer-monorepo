<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ChevronUpChevronDown18Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 18 } = defineProps<ChevronUpChevronDown18Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 18" :width="size" :height="size"><path fill="currentColor" d="M7 2.488q.116 0 .226.048a1 1 0 0 1 .239.15l4.607 3.747q.185.157.185.444a.64.64 0 0 1-.082.321.61.61 0 0 1-.547.308.7.7 0 0 1-.226-.041 1 1 0 0 1-.225-.144L7 3.924 2.823 7.32q-.123.096-.232.144a.6.6 0 0 1-.226.04.64.64 0 0 1-.321-.081.64.64 0 0 1-.3-.547q-.001-.287.184-.444l4.607-3.746a1 1 0 0 1 .233-.15A.6.6 0 0 1 7 2.487M7 15.64a.6.6 0 0 1-.232-.048 1 1 0 0 1-.233-.15l-4.607-3.747q-.185-.157-.185-.45 0-.18.082-.315a.6.6 0 0 1 .219-.226.64.64 0 0 1 .321-.082q.117 0 .226.048.11.04.232.137L7 14.205l4.177-3.397a.8.8 0 0 1 .225-.137.612.612 0 0 1 .854.574q.001.294-.184.451l-4.607 3.746a1 1 0 0 1-.24.15.6.6 0 0 1-.225.049"/></svg>
</template>