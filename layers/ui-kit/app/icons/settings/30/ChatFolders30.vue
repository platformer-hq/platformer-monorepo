<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ChatFolders30Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 30 } = defineProps<ChatFolders30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#32ade6" rx="8"/><path fill="#fff" d="M22.1 13c.84 0 1.26 0 1.58.163.283.144.513.374.657.656.163.321.163.742.163 1.581v1.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.749C21.461 23 20.34 23 18.1 23h-6.2c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C5.5 19.961 5.5 18.84 5.5 16.6v-1.2c0-.84 0-1.26.163-1.58.144-.283.374-.513.656-.657C6.64 13 7.061 13 7.9 13zM11.42 6.005a3 3 0 0 1 1.84.762l.48.466a3 3 0 0 0 1.84.762c.081.005.165.005.334.005h5.65c.872 0 1.308 0 1.655.134a2 2 0 0 1 1.147 1.147c.134.347.134.783.134 1.654 0 .218 0 .328-.033.415a.5.5 0 0 1-.287.287c-.087.033-.196.033-.414.033H6.3c-.28 0-.42 0-.527-.055a.5.5 0 0 1-.218-.217C5.5 11.29 5.5 11.15 5.5 10.87v-.07c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.31-1.31C7.78 6 8.62 6 10.3 6h.786c.168 0 .253 0 .334.005"/></svg>
</template>