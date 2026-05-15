<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';
import { bem } from '@/utils/bem';

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
</script>

<template>
  <component :is="as" :class="b({'no-right': !$slots.right})">
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
}
</style>
