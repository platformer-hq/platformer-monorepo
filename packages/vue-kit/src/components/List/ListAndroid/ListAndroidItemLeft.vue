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
const { b } = bem('tgui-list-android-item-left');
</script>

<template>
  <div :class="b(size)" :style="{width: toPx(width)}">
    <slot/>
  </div>
</template>

<style lang="scss">
.tgui-list-android-item-left {
  &--small {
    width: 32px;
  }

  &--default {
    width: 44px;
  }

  &--large {
    width: 51px;
  }
}
</style>
