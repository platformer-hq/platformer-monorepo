<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';
import { bem } from '@/utils/bem.js';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'div',
});

import { injectListItemOptions } from './provider.js';

defineSlots<{
  left(): unknown;
  right(): unknown;
}>();

const { b } = bem('tgui-list-android-item-body');
const { large } = injectListItemOptions();
</script>

<template>
  <component :is="as" :class="b(large ? 'large' : 'small', {'no-right': !$slots.right})">
    <slot name="left" />
    <slot name="right" />
  </component>
</template>

<style lang="scss">
.tgui-list-android-item-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  box-sizing: border-box;
  overflow: hidden;
  padding-right: 20px;

  &--no-right {
    grid-template-columns: 1fr;
  }

  &--small {
    min-height: 50px;
  }

  &--large {
    min-height: 58px;
  }
}
</style>
