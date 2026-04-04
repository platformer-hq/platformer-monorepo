<script setup lang="ts">
import { bem } from '@/utils/bem';
import { toPx } from '@/utils/toPx';

const { size = 'default' } = defineProps<{
  width?: number | string;
  /**
   * @default 'default'
   */
  size?: 'default' | 'small' | 'large';
}>();
const { b } = bem('list-ios-item-left');
</script>

<template>
  <div :class="b(size)" :style="{width: toPx(width)}">
    <slot/>
  </div>
</template>

<style lang="scss">
.list-ios-item-left {
  &--small {
    width: 32px;
  }

  &--default {
    width: 50px;
  }
}
</style>
