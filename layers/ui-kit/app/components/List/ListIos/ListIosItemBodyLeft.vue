<script setup lang="ts">
import { injectListItemOptions } from './provider.js';

defineProps<{
  /**
   * True if the elements direction must be reversed.
   */
  reversed?: boolean;
}>();
defineSlots<{
  label(): unknown;
  subtitle(): unknown;
}>();

const { large } = injectListItemOptions();
const { b } = bem('list-ios-item-body-left');
</script>

<template>
  <div
    :class="b(
      {
        reversed,
        'small-reversed': reversed && !large,
        'label-only': !$slots.subtitle
      },
      large ? 'large' : 'small'
    )"
  >
    <slot name="label" />
    <slot name="subtitle"/>
  </div>
</template>

<style lang="scss">
.list-ios-item-body-left {
  display: flex;
  flex: 1 0 0;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;

  &--reversed {
    flex-flow: column-reverse;
  }

  &--small {
    padding: 4px 0 6px;

    &--reversed {
      padding: 6px 0 4px;
    }
  }

  &--large {
    padding: 10px 0 9px;
    gap: 1px;
  }

  &--label-only {
    padding: 15px 0;
  }
}
</style>
