<script setup lang="ts">
const { size = 'small' } = defineProps<{
  /**
   * The icon size.
   * - `small` - 28px
   * - `large` - 42px
   * @default 'small'
   */
  size?: 'small' | 'large';
  /**
   * True if the icon is supposed to be square. This only adds a left padding and adds border
   * radius to the icon.
   */
  square?: boolean;
}>();

const { b } = bem('list-android-item-left-icon-element');
</script>

<template>
  <i :class="b({ rounded: square }, size)">
    <slot/>
  </i>
</template>

<style lang="scss">
.list-android-item-left-icon-element {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &--small {
    width: 28px;
    height: 28px;
  }

  &--large {
    width: 42px;
    height: 42px;
    margin-left: -6px;
  }

  &--rounded {
    border-radius: 8px;
  }
}
</style>
