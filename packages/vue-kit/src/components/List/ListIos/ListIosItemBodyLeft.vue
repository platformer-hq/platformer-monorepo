<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';
import { bem } from '@/utils/bem.js';

import { injectListItemOptions } from './provider.js';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  /**
   * True if the elements direction must be reversed.
   */
  reversed?: boolean;
}>(), {
  as: 'div',
});
defineSlots<{
  input(): unknown;
  label(): unknown;
  subtitle(): unknown;
}>();

const { large } = injectListItemOptions();
const { b, e } = bem('tgui-list-ios-item-body-left');
</script>

<template>
  <component :is="as" :class="b()">
    <slot v-if="'input' in $slots" name="input"/>
    <div
      v-else
      :class="e('texts', large ? 'large' : 'small', {
        reversed,
        'small-reversed': reversed && !large,
        'label-only': !('subtitle' in $slots)
      })"
    >
      <slot name="label" />
      <slot name="subtitle"/>
    </div>
  </component>
</template>

<style lang="scss">
.tgui-list-ios-item-body-left {
  height: 100%;
  min-width: 0;

  &__texts {
    height: 100%;
    display: flex;
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
