<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform';

import { injectListItemOptions } from './_provider';

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

const platform = usePlatform();

const { large } = injectListItemOptions({ large: false, separator: true });
const { b, e } = bem('list-item-body-left');
</script>

<template>
  <div :class="b()">
    <slot v-if="'input' in $slots" name="input"/>
    <div
      v-else
      :class="e('texts', platform, {reversed}, platform === 'ios' && {
        [`ios-${large ? 'large' : 'small'}`]: true,
        'ios-small-reversed': !large && reversed,
      })"
    >
      <slot name="label" />
      <slot name="subtitle"/>
    </div>
  </div>
</template>

<style lang="scss">
.list-item-body-left {
  min-width: 0;
  height: 100%;

  &__texts {
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;

    &--reversed {
      flex-flow: column-reverse;
    }

    &--android {
      gap: 2px;
      padding: 10px 0;
    }

    &--ios {
      &-small {
        padding: 4px 0 6px;
      }

      &-small-reversed {
        padding: 6px 0 4px;
      }

      &-large {
        padding: 10px 0 9px;
        gap: 1px;
      }
    }
  }
}

</style>
