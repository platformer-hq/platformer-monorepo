<script setup lang="ts">
/* eslint-disable */
export interface Star20Props {
  size?: string | number;
}

const { size = 20 } = defineProps<Star20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" fill-rule="evenodd" d="M7.058 6.363 9.12 2.339a.963.963 0 0 1 1.71.007l1.948 3.88c.159.317.47.534.826.576l4.078.479c.553.065.948.56.882 1.104a1 1 0 0 1-.295.592l-3.222 3.114a.57.57 0 0 0-.171.482l.536 4.204a1.1 1.1 0 0 1-.969 1.226 1.13 1.13 0 0 1-.671-.125l-3.405-1.822a.86.86 0 0 0-.793-.01l-3.527 1.773a1.017 1.017 0 0 1-1.358-.433 1 1 0 0 1-.1-.594l.281-1.929a2.93 2.93 0 0 1 1.597-2.193l3.918-1.96a.21.21 0 0 0 .093-.282.21.21 0 0 0-.22-.112l-4.791.672a2.7 2.7 0 0 1-2.05-.559L1.821 9.153a1.035 1.035 0 0 1-.154-1.472c.172-.208.419-.343.69-.378l4.09-.516a.8.8 0 0 0 .611-.424" clip-rule="evenodd"/></svg>
</template>