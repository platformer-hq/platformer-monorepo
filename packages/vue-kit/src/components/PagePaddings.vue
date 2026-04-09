<script setup lang="ts">
import type { KnownHtmlTag } from '@/types';
import { bem } from '@/utils/bem';

export interface PagePaddingsProps {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  /**
   * @default true
   */
  top?: boolean;
  /**
   * @default true
   */
  left?: boolean;
  /**
   * @default true
   */
  right?: boolean;
  /**
   * @default true
   */
  bottom?: boolean;
}

const {
  as = 'div',
  bottom = true,
  left = true,
  right = true,
  top = true,
} = defineProps<PagePaddingsProps>();

const { b } = bem('tgui-page-paddings');
</script>

<template>
  <component :is="as" :class="b({top, left, bottom, right})">
    <slot/>
  </component>
</template>

<style lang="scss">
.tgui-page-paddings {
  @each $side in ("top", "left", "right", "bottom") {
    &--#{$side} {
      padding-#{$side}: var(--tgui-page-paddings-#{$side}, 16px);
    }
  }
}
</style>
