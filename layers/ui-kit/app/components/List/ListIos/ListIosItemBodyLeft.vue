<script setup lang="ts">
import { injectListItemOptions } from './provider.js';

defineProps<{
  /**
   * True if the elements direction must be reversed.
   */
  reversed?: boolean;
}>();
defineSlots<{
  input(): unknown;
  label(): unknown;
  subtitle(): unknown;
}>();

const { large } = injectListItemOptions();
const { b, e } = bem('list-ios-item-body-left');
</script>

<template>
  <div :class="b()">
    <slot v-if="$slots.input" name="input"/>
    <div
      v-else
      :class="e('texts', large ? 'large' : 'small', {
        reversed,
        'small-reversed': reversed && !large,
        'label-only': !$slots.subtitle
      })"
    >
      <slot name="label" />
      <slot name="subtitle"/>
    </div>
  </div>
</template>

<style lang="scss">
.list-ios-item-body-left {
  flex: 1 0 0;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;

  &__texts {
    height: 100%;
    display: flex;
    flex: 1 0 0;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;

    &--reversed {
      flex-flow: column-reverse;
    }

    &--small {
      padding: 4px 0 6px;
    }

    &--small-reversed {
      padding: 6px 0 4px;
    }

    &--large {
      padding: 10px 0 9px;
      gap: 1px;
    }

    &--label-only {
      padding: 15px 0;
    }
  }
}
</style>
