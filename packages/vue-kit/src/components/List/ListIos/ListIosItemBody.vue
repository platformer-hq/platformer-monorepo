<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';
import { bem } from '@/utils/bem';

import { injectListItemOptions } from './provider';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'div',
});

defineSlots<{
  left(): unknown;
  right(): unknown;
}>();

const { b } = bem('tgui-list-ios-item-body');
const { large } = injectListItemOptions();
</script>

<template>
  <component :is="as" :class="b(large ? 'large' : 'small', {'no-right': !$slots.right})">
    <slot name="left" />
    <slot name="right" />
  </component>
</template>

<style lang="scss">
.tgui-list-ios-item-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  box-shadow: 0 0.33px 0 var(--tgui-list-ios-item-body-separator-color);
  margin-right: 16px;

  &--no-right {
    grid-template-columns: 1fr;
  }

  &--small {
    min-height: 52px;
  }

  &--large {
    min-height: 60px;
  }
}
</style>
