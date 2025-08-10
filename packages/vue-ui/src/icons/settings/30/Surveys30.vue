<script setup lang="ts">
/* eslint-disable */
export interface Surveys30Props {
  size?: string | number;
}

const { size = 30 } = defineProps<Surveys30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="currentColor" rx="7"/><path fill="#fff" fill-rule="evenodd" d="M9.5 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.913-4.468a.5.5 0 1 0-.826-.564L9.053 10.72l-.671-.793a.5.5 0 0 0-.764.646l1.096 1.295a.5.5 0 0 0 .795-.041z" clip-rule="evenodd"/><path fill="#fff" d="M14.835 10c0-.367.298-.665.665-.665h8a.665.665 0 1 1 0 1.33h-8a.665.665 0 0 1-.665-.665"/><path fill="#fff" fill-rule="evenodd" d="M9.5 23.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m0-1.33a2.17 2.17 0 1 0 0-4.34 2.17 2.17 0 0 0 0 4.34" clip-rule="evenodd"/><path fill="#fff" d="M14.835 20c0-.367.298-.665.665-.665h8a.665.665 0 1 1 0 1.33h-8a.665.665 0 0 1-.665-.665"/></svg>
</template>