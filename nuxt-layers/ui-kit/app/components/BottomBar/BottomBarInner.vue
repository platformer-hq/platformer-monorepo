<script setup lang="ts">
import { bem } from '@/utils/bem';

const { b } = bem('bottom-bar-inner');

defineProps<{
  variant?: '2-columns';
}>();
</script>

<template>
  <div :class="b(variant)">
    <slot/>
  </div>
</template>

<style lang="scss">
.bottom-bar-inner {
  padding: 8px 16px 16px;

  &--2-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}
</style>
