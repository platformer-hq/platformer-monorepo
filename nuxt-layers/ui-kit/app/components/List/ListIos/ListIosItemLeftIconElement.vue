<script setup lang="ts">
import type { KnownHtmlTag } from '#ui-kit/types';

withDefaults(defineProps<{
  /**
   * @default 'i'
   */
  as?: KnownHtmlTag;
  /**
   * The icon size.
   * - `small` - 28px
   * - `large` - 40px
   * @default 'small'
   */
  size?: 'small' | 'large';
  rounded?: boolean;
}>(), {
  as: 'i',
  size: 'small',
});

const { b } = bem('tgui-list-ios-item-left-icon-element');
</script>

<template>
  <component :is="as" :class="b({ rounded }, size)">
    <slot/>
  </component>
</template>

<style lang="scss">
.tgui-list-ios-item-left-icon-element {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &--small {
    width: 28px;
    height: 28px;
  }

  &--large {
    width: 40px;
    height: 40px;
  }

  &--rounded {
    border-radius: 8px;
  }
}
</style>
