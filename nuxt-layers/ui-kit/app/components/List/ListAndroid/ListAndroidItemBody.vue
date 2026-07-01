<script setup lang="ts">
import type { KnownHtmlTag } from '#ui-kit/types';

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

const { b } = bem('tgui-list-android-item-body');
</script>

<template>
  <component :is="as" :class="b({'no-right': !$slots.right})">
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
}
</style>
