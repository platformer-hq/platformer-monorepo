<script setup lang="ts">
import { bem } from '@/utils/bem';

withDefaults(defineProps<{
  /**
   * The icon size.
   * - `small` - 28px
   * - `large` - 40px
   * @default 'small'
   */
  size?: 'small' | 'large';
  rounded?: boolean;
}>(), {
  size: 'small',
});

const { b } = bem('tgui-list-ios-item-left-icon-element');
</script>

<template>
  <i :class="b({ rounded }, size)">
    <slot/>
  </i>
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
