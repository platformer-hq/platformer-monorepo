<script setup lang="ts">
import { bem } from '@/utils/bem';
import { toPx } from '@/utils/toPx';

withDefaults(defineProps<{
  width?: number | string;
  /**
   * @default 'default'
   */
  size?: 'default' | 'small' | 'large';
}>(), {
  size: 'default',
});
const { b } = bem('tgui-list-ios-item-left');
</script>

<template>
  <div :class="b(size)" :style="{width: toPx(width)}">
    <slot/>
  </div>
</template>

<style lang="scss">
.tgui-list-ios-item-left {
  &--small {
    width: 32px;
  }

  &--default {
    width: 50px;
  }
}
</style>
