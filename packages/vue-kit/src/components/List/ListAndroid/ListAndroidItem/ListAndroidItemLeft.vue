<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags';
import { bem } from '@/utils/bem';
import { toPx } from '@/utils/toPx';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  width?: number | string;
  /**
   * @default 'default'
   */
  size?: 'default' | 'small' | 'large';
}>(), {
  as: 'div',
  size: 'default',
});
const { b } = bem('tgui-list-android-item-left');
</script>

<template>
  <component :is="as" :class="b(size)" :style="{width: toPx(width)}">
    <slot/>
  </component>
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
