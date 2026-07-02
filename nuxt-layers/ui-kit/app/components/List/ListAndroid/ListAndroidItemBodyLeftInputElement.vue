<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';

const props = withDefaults(defineProps<{
  multiline?: boolean;
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
const typographyAttrs = useTypographyAndroidAttrs({ variant: 'body' });

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

defineExpose({ input: inputRef });
</script>

<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    ref="input"
    :class="['tgui-list-android-item-body-left-input-element', typographyAttrs.classes]"
    :style="typographyAttrs.style"
    :value="model"
    @input="model = $event.target.value"
  />
</template>

<style lang="scss">
@use "~scss/mixins";

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
