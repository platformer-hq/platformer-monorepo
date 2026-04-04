<script setup lang="ts">
/* eslint-disable */
export interface DataAndStorage30Props {
  size?: string | number;
}

const { size = 30 } = defineProps<DataAndStorage30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#34c759" rx="8"/><path fill="#fff" d="M21.785 12.383c-1.798.6-4.196.947-6.785.947-2.588 0-4.987-.348-6.785-.947a10 10 0 0 1-1.37-.565c-.366-.187-.845.064-.845.474V15c0 1.657 4.03 3 9 3s9-1.343 9-3v-2.708c0-.41-.48-.661-.845-.474a10 10 0 0 1-1.37.565"/><path fill="#fff" d="M24 18.292c0-.41-.48-.661-.845-.474a10 10 0 0 1-1.37.565c-1.798.6-4.197.947-6.785.947s-4.987-.348-6.785-.947a10 10 0 0 1-1.37-.565c-.366-.187-.845.064-.845.474V21c0 1.657 4.03 3 9 3s9-1.343 9-3zM15 12c4.97 0 9-1.343 9-3s-4.03-3-9-3-9 1.343-9 3 4.03 3 9 3"/></svg>
</template>