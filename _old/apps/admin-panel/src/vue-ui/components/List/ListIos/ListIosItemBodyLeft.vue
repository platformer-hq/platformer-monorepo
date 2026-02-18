<script setup lang="ts">
import { bem } from 'vue-ui';

import { injectListItemOptions } from './provider.js';

defineProps<{
  /**
   * True if the elements direction must be reversed. Applicable only when using list item with
   * the "large" = true property.
   */
  reversed?: boolean;
}>();
defineSlots<{
  label(): any;
  subtitle(): any;
}>();

const { large } = injectListItemOptions();
const [b] = bem('tgui-list-ios-item-body-left');
</script>

<template>
  <div :class="b({ reversed, large })">
    <slot name="label" />
    <slot
      v-if="large"
      name="subtitle"
    />
  </div>
</template>

<style lang="scss">
.tgui-list-ios-item-body-left {
  display: flex;
  flex: 1 0 0;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  padding: 11px 16px 11px 0;

  &--reversed {
    flex-flow: column-reverse;
  }

  &--large {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
