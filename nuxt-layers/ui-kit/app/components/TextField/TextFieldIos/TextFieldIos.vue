<script lang="ts" setup>
export interface TextFieldIosProps {
  rounded?: boolean;
  elevated?: boolean;
}

defineProps<TextFieldIosProps>();
defineSlots<{
  left(): unknown;
  input(): unknown;
  right(): unknown;
}>();

const { b } = bem('tgui-text-field-ios');
</script>

<template>
  <label :class="b({rounded, 'with-left': !!$slots.left, elevated})">
    <slot name="left"/>
    <slot name="input"/>
    <slot name="right"/>
  </label>
</template>

<style lang="scss">
.tgui-text-field-ios {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  background-color: var(--tgui-text-field-ios-bg-color, rgba(118, 118, 128, 0.24));
  color: var(--tgui-text-field-ios-text-color, black);
  border-radius: 16px;
  height: 44px;
  padding-inline: 16px;
  overflow: hidden;

  &--elevated {
    box-shadow: var(--tgui-elevated-box-shadow);
  }

  &--rounded {
    border-radius: 1000px;
  }

  &--with-left {
    grid-template-columns: auto 1fr;
  }
}
</style>
