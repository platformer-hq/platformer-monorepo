<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { mergeProps } from 'vue';

defineProps<{
  multiline?: boolean;
}>();
defineOptions({ inheritAttrs: false });

const { b } = bem('list-android-item-body-input-element');
const model = defineModel<string>({ default: '' });
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input');

useTextareaAutosize({
  input: model,
  element: computed(() => {
    return inputRef.value instanceof HTMLTextAreaElement ? inputRef.value : undefined;
  }),
});

// Telegram for Android doesn't handle click outside and doesn't lose focus on the input.
onClickOutside(inputRef, () => {
  inputRef.value?.blur();
});

defineExpose({
  input: inputRef,
});
</script>

<template>
  <UseTypographyAndroid v-slot="{classes, style}" variant="body">
    <component
      :is="multiline ? 'textarea' : 'input'"
      ref="input"
      v-bind="mergeProps($attrs, { class: [b(), classes], style })"
      :value="model"
      @input="model = $event.target.value"
    />
  </UseTypographyAndroid>
</template>

<style lang="scss">
@use "@ui-kit-mixins" as mixins;

.list-android-item-body-input-element {
  border: none;
  background: transparent;
  appearance: none;
  display: block;
  outline: none;
  position: relative;
  resize: none;
  padding-block: 15px;
  width: 100%;
  color: var(--list-android-item-body-left-input-text-color);
  @include mixins.hideScrollbar;
  @include mixins.noHighlight;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--list-android-item-body-left-input-placeholder-color);
  }
}
</style>
