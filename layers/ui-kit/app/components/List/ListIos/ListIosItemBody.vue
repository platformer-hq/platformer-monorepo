<script setup lang="ts">
import { injectListItemOptions } from './provider';

defineSlots<{
  input(): unknown;
  left(): unknown;
  right(): unknown;
}>();

const { b } = bem('list-ios-item-body');
const { large } = injectListItemOptions();
</script>

<template>
  <div :class="b(large ? 'large' : 'small')">
    <slot v-if="$slots.input" name="input"/>
    <template v-else>
      <slot name="left" />
      <slot name="right" />
    </template>
  </div>
</template>

<style lang="scss">
.list-ios-item-body {
  flex: 1 0 0;
  box-shadow: 0 0.33px 0 var(--section-separator-color);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 16px;

  &--small {
    min-height: 52px;
  }

  &--large {
    min-height: 60px;
  }
}
</style>
