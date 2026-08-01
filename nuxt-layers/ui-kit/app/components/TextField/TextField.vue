<script lang="ts" setup>
import type { KnownCssColorToken } from '~colors/generated';
import { usePlatform } from '~ui-kit/_composables/usePlatform';

defineProps<{
  bgColor?: KnownCssColorToken;
  textColor?: KnownCssColorToken;
  rounded?: boolean;
  glass?: boolean;
}>();
defineSlots<{
  left(): unknown;
  input(): unknown;
  right(): unknown;
}>();

const platform = usePlatform();

const { b } = bem('text-field');
</script>

<template>
  <label
    :class="b({'with-left': !!$slots.left, glass, rounded}, platform)"
    :style="{
      background: bgColor ? cssColorTokenReference(bgColor) : undefined,
      color: textColor ? cssColorTokenReference(textColor) : undefined,
    }"
  >
    <slot name="left"/>
    <slot name="input"/>
    <slot name="right"/>
  </label>
</template>

<style lang="scss">
.text-field {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  background-color: var(--tertiary-fill-background);
  color: var(--text-color);
  overflow: hidden;

  &--ios {
    border-radius: 16px;
  height: 44px;
  padding-inline: 16px;
  }

  &--android {
    border-radius: 1000px;
    height: 48px;
    padding-inline: 18px;
  }

  &--glass {
    box-shadow: var(--glass-box-shadow);
  }

  &--rounded {
    border-radius: 1000px;
  }

  &--with-left {
    grid-template-columns: auto 1fr;
  }
}
</style>
