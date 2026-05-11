<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

import { useTypographyAndroidAttrs } from '@/components/Typography/TypographyAndroid/composables/useTypographyAndroidAttrs.js';
import { bem } from '@/utils/bem';

withDefaults(defineProps<{
  multiline?: boolean;
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'disabled';
}>(), {
  variant: 'regular',
});

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

const { b } = bem('tgui-list-android-item-body-left-input-element');
</script>

<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    ref="input"
    :class="[b(variant), typographyAttrs.classes]"
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
  @include mixins.hideScrollbar;
  @include mixins.noHighlight;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @each $variant in ("regular", "disabled") {
    &--#{$variant} {
      color: var(--tgui-list-android-item-body-left-input-element-#{$variant}-text-color);

      &::placeholder {
        color: var(--tgui-list-android-item-body-left-input-element-#{$variant}-placeholder-color);
      }
    }
  }
}
</style>
