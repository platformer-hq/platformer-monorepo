<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform.js';

import { injectListItemOptions } from './_provider.js';

defineSlots<{
  left(): unknown;
  right(): unknown;
}>();

const platform = usePlatform();

const { b } = bem('list-item-body');
const { large, separator } = injectListItemOptions({ large: false, separator: true });
</script>

<template>
  <div
    :class="b({
      'no-right': !$slots.right,
      'ios-separator': platform === 'ios' && separator,
      [`android-${large ? 'large' : 'small'}`]: platform === 'android',
    }, platform)"
  >
    <slot name="left" />
    <slot name="right" />
  </div>
</template>

<style lang="scss">
.list-item-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;

  &--android {
    box-sizing: border-box;
    overflow: hidden;
    padding-right: 20px;

    &-small {
      min-height: 50px;
    }

    &-large {
      min-height: 58px;
    }
  }

  &--ios {
    margin-right: 16px;
    min-height: 52px;

    &-separator {
      box-shadow: 0 0.33px 0 var(--section-separator-color);
    }
  }

  &--no-right {
    grid-template-columns: 1fr;
  }
}
</style>
