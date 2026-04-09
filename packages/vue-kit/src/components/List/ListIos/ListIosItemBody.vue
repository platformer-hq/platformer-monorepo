<script setup lang="ts">
import { bem } from '@/utils/bem';

import { injectListItemOptions } from './provider';

defineSlots<{
  left(): unknown;
  right(): unknown;
}>();

const { b } = bem('list-ios-item-body');
const { large } = injectListItemOptions();
</script>

<template>
  <div :class="b(large ? 'large' : 'small', {'no-right': !$slots.right})">
    <slot name="left" />
    <slot name="right" />
  </div>
</template>

<style lang="scss">
.list-ios-item-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  box-shadow: 0 0.33px 0 var(--section-separator-color);
  margin-right: 16px;

  &--no-right {
    grid-template-columns: 1fr;
  }

  &--small {
    min-height: 52px;
  }

  &--large {
    min-height: 60px;
  }
}
</style>
