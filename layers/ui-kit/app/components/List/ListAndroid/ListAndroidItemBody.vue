<script setup lang="ts">
import { injectListItemOptions } from './provider';

defineSlots<{
  input(): unknown;
  left(): unknown;
  right(): unknown;
}>();

const { b } = bem('list-android-item-body');
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
.list-android-item-body {
  display: flex;
  flex: 1 0 0;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 0.5px 0 var(--list-android-item-body-separator-color);
  overflow: hidden;
  padding-right: 20px;

  &--small {
    min-height: 50px;
  }

  &--large {
    min-height: 58px;
  }
}
</style>
