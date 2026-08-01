<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';

const { size = 'default' } = defineProps<{
  width?: number | string;
  /**
   * @default 'default'
   */
  size?: 'default' | 'small' | 'large';
}>();

const platform = usePlatform();

const { b } = bem('list-item-left');
</script>

<template>
  <div
    :class="b(size === 'small' ? 'small' : (
      platform === 'android'
        ? `android-${size}`
        : 'ios-default'
    ))"
    :style="{width: toPx(width)}"
  >
    <slot/>
  </div>
</template>

<style lang="scss">
.list-item-left {
  &--small {
    width: 32px;
  }

  &--android {
    &-default {
      width: 44px;
    }

    &-large {
      width: 51px;
    }
  }

  &--ios {
    &-default {
      width: 50px;
    }
  }
}
</style>
