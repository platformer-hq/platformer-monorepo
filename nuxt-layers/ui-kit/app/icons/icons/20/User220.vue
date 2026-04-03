<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface User220Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<User220Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentColor" d="M13.333 9.752c-1.403 0-2.571-1.244-2.571-2.825 0-1.542 1.174-2.774 2.57-2.774 1.397 0 2.578 1.213 2.578 2.762 0 1.593-1.175 2.837-2.578 2.837m-7.357.14c-1.22 0-2.241-1.086-2.241-2.457 0-1.346 1.028-2.412 2.24-2.412s2.25 1.047 2.25 2.406c0 1.377-1.029 2.463-2.247 2.463m-3.473 5.782c-.888 0-1.212-.38-1.212-1.047 0-1.695 1.866-3.77 4.685-3.77 1.117 0 2.03.323 2.723.761-1.473 1.168-2.171 3.079-1.486 4.056zm6.894 0c-1.08 0-1.441-.336-1.441-.94 0-1.63 2.082-3.865 5.376-3.865 3.289 0 5.377 2.235 5.377 3.866 0 .603-.368.94-1.44.94z"/></svg>
</template>