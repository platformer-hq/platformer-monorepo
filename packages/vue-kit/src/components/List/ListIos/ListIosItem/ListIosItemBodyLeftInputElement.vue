<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { computed, onWatcherCleanup, useTemplateRef, watch } from 'vue';

import { useTypographyIosAttrs } from '@/components/Typography/TypographyIos/composables/useTypographyIosAttrs';

const props = withDefaults(defineProps<{
  multiline?: boolean;
  /**
   * True if the element should be scrollable into view when focused. This is sometimes required
   * for Telegram for iOS when the input is being focused and the keyboard is shown, hiding
   * the input itself.
   */
  scrollIntoViewOnFocus?: boolean;
  /**
   * True if the element should blur on click outside.
   * @default true
   */
  blurOnClickOutside?: boolean;
}>(), {
  blurOnClickOutside: true,
});

const model = defineModel<string | undefined>({ default: '' });
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input');
const typographyAttrs = useTypographyIosAttrs({ variant: 'body' });

useTextareaAutosize({
  input: computed(() => model.value || ''),
  element: computed(() => {
    return inputRef.value instanceof HTMLTextAreaElement ? inputRef.value : undefined;
  }),
});

// Both Telegram for iOS and Adnroid don't handle click outside and don't lose focus on
// the input.
watch(() => props.blurOnClickOutside, blur => {
  if (blur) {
    onWatcherCleanup(
      onClickOutside(inputRef, () => {
        inputRef.value?.blur();
      }),
    );
  }
});

// Sometimes Telegram for iOS scrolls the input into view improperly. So,
// after the keyboard was shown, we are scrolling the input into view.
const onFocus = (e: FocusEvent) => {
  if (props.scrollIntoViewOnFocus) {
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
  color: var(--input-text-color);
  @include mixins.hideScrollbar;
  @include mixins.noHighlight;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--input-placeholder-color);
  }
}
</style>
