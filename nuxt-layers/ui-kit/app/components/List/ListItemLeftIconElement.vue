<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';

withDefaults(defineProps<{
  /**
   * The icon size.
   * - `small` - 28px
   * - `large` - 42px
   * @default 'small'
   */
  size?: 'small' | 'large';
  rounded?: boolean;
}>(), {
  size: 'small',
});

const platform = usePlatform();

const { b } = bem('list-item-left-icon-element');
</script>

<template>
  <i :class="b({ rounded }, size === 'small' ? size : `${platform}-${size}`)">
    <slot/>
  </i>
</template>

<style lang="scss">
.list-item-left-icon-element {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &--small {
    width: 28px;
    height: 28px;
  }

  &--ios {
    &-large {
      width: 40px;
      height: 40px;
    }
  }

  &--android {
    &-large {
      width: 42px;
      height: 42px;
      margin-left: -6px;
    }
  }

  &--rounded {
    border-radius: 8px;
  }
}
</style>
