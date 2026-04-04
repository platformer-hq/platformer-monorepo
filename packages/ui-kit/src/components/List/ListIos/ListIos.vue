<script setup lang="ts">
import { bem } from '@/utils/bem';

const { b } = bem('list-ios');
</script>

<template>
  <ul :class="b()">
    <slot />
  </ul>
</template>

<style lang="scss">
.list-ios {
  appearance: none;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
