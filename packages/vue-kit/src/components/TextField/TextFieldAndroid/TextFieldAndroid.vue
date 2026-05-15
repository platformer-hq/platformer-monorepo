<script lang="ts" setup>
import { bem } from '@/utils/bem';

defineSlots<{
  left(): unknown;
  input(): unknown;
  right(): unknown;
}>();

const { b } = bem('tgui-text-field-android');
</script>

<template>
  <label :class="b({'with-left': !!$slots.left})">
    <slot name="left"/>
    <slot name="input"/>
    <slot name="right"/>
  </label>
</template>

<style lang="scss">
.tgui-text-field-android {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  background-color: var(--tgui-text-field-android-bg-color, rgba(118, 118, 128, 0.24));
  color: var(--tgui-text-field-android-text-color, black);
  border-radius: 1000px;
  height: 48px;
  padding-inline: 18px;
  overflow: hidden;

  &--with-left {
    grid-template-columns: auto 1fr;
  }
}
</style>
