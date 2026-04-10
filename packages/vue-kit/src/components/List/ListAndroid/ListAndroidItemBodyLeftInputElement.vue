<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

import { useTypographyAndroidAttrs } from '@/components/Typography/TypographyAndroid/composables/useTypographyAndroidAttrs.js';

defineProps<{ multiline?: boolean }>();

const model = defineModel<string | undefined>({ default: '' });
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input');
const typographyAttrs = useTypographyAndroidAttrs({ variant: 'body' });

useTextareaAutosize({
  input: computed(() => model.value || ''),
  element: computed(() => {
    return inputRef.value instanceof HTMLTextAreaElement ? inputRef.value : undefined;
  }),
});

// Telegram for Android doesn't handle click outside and doesn't lose focus on the input.
onClickOutside(inputRef, () => {
  inputRef.value?.blur();
});

defineExpose({ input: inputRef });
</script>

<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    ref="input"
    :class="['tgui-list-android-item-body-input-element', typographyAttrs.classes]"
    :style="typographyAttrs.style"
    :value="model"
    @input="model = $event.target.value"
  />
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.tgui-list-android-item-body-left-input-element {
  border: none;
  background: transparent;
  appearance: none;
  display: block;
  outline: none;
  position: relative;
  resize: none;
  padding-block: 15px;
  width: 100%;
  color: var(--tgui-list-android-item-body-left-input-text-color);
  @include mixins.hideScrollbar;
  @include mixins.noHighlight;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--tgui-list-android-item-body-left-input-placeholder-color);
  }
}
</style>
