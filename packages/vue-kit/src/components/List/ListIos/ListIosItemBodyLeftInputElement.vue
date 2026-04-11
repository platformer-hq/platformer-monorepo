<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

import { useTypographyIosAttrs } from '@/components/Typography/TypographyIos/composables/useTypographyIosAttrs';
import { useKeyboardVisibility } from '@/composables/useKeyboardVisibility';

defineProps<{ multiline?: boolean }>();

const model = defineModel<string | undefined>({ default: '' });
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input');
const typographyAttrs = useTypographyIosAttrs({ variant: 'body' });
const keyboard = useKeyboardVisibility();

useTextareaAutosize({
  input: computed(() => model.value || ''),
  element: computed(() => {
    return inputRef.value instanceof HTMLTextAreaElement ? inputRef.value : undefined;
  }),
});

// Both Telegram for iOS and Adnroid don't handle click outside and don't lose focus on
// the input.
onClickOutside(inputRef, () => {
  inputRef.value?.blur();
});

// Sometimes Telegram for iOS scrolls the input into view improperly. So,
// after the keyboard was shown, we are scrolling the input into view.
const onFocus = (e: FocusEvent) => {
  // FIXME: This should one should depend on if the keyboard exists at all. We can use
  // this component in macOS, but there should not be this kind of behavior there.
  if (!keyboard.isShown) {
    // If the keyboard is not shown, then it is going to. It takes about 500 ms
    // for the keyboard to appear.
    setTimeout(() => {
      (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }
};

defineExpose({ input: inputRef });
</script>

<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    ref="input"
    :class="['tgui-list-ios-item-body-left-input-element', typographyAttrs.classes]"
    :style="typographyAttrs.style"
    :value="model"
    @input="model = $event.target.value"
    @focus="onFocus"
  />
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.tgui-list-ios-item-body-left-input-element {
  border: none;
  background: transparent;
  appearance: none;
  display: block;
  height: 100%;
  outline: none;
  position: relative;
  resize: none;
  padding: 15px 0;
  width: 100%;
  color: var(--tgui-list-ios-item-body-left-input-text-color);
  @include mixins.hideScrollbar;
  @include mixins.noHighlight;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--tgui-list-ios-item-body-left-input-placeholder-color);
  }
}
</style>
