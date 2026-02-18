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
const { b } = bem('list-android-item-body-left');
</script>

<template>
  <div :class="b({ reversed, 'label-only': !$slots.subtitle }, large ? 'large' : 'small')">
    <slot name="label" />
    <slot name="subtitle"/>
  </div>
</template>

<style lang="scss">
.list-android-item-body-left {
  display: flex;
  flex: 1 0 0;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  padding-right: 16px;
  gap: 2px;
  padding: 10px 0;

  &--reversed {
    flex-flow: column-reverse;
  }

  &--label-only {
    padding: 15px 0;
  }
}

</style>
