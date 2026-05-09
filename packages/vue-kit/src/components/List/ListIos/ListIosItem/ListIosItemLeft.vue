<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';
import { bem } from '@/utils/bem';
import { toPx } from '@/utils/toPx';

// TODO: Rename sizes.

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  width?: number | string;
  /**
   * @default 'default'
   */
  size?: 'default' | 'small';
}>(), {
  as: 'div',
  size: 'default',
});
const { b } = bem('tgui-list-ios-item-left');
</script>

<template>
  <component :is="as" :class="b(size)" :style="{width: toPx(width)}">
    <slot/>
  </component>
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
