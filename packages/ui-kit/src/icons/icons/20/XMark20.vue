<script setup lang="ts">
/* eslint-disable */
export interface XMark20Props {
  size?: string | number;
}

const { size = 20 } = defineProps<XMark20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M15.662 14.231a.825.825 0 0 1-.008 1.15.827.827 0 0 1-1.157.007l-4.504-4.504-4.505 4.504c-.3.3-.835.308-1.157-.007a.825.825 0 0 1 0-1.15l4.505-4.512L4.33 5.215c-.307-.3-.307-.835 0-1.157a.834.834 0 0 1 1.157 0l4.505 4.504 4.504-4.504a.827.827 0 0 1 1.157.007.82.82 0 0 1 .008 1.15l-4.505 4.504z"/></svg>
</template>