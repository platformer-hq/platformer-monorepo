<script setup lang="ts">
import type { KnownHtmlTag } from '#ui-kit/types';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  /**
   * True if the left small padding should be added.
   */
  padLeft?: boolean;
}>(), {
  as: 'div',
});

const { b } = bem('tgui-list-ios-item-left-icon');
</script>

<template>
  <component :is="as" :class="b({'pad-left': padLeft})">
    <slot/>
  </component>
</template>

<style lang="scss">
.tgui-list-ios-item-left-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &--pad-left {
    padding-left: 6px;
  }
}
</style>
