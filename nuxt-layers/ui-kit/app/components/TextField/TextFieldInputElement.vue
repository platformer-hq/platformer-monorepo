<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';

import type {
  TypographyVariant,
  TypographyWeight,
} from '~/components/VTypography/VTypography.vue';

const props = withDefaults(defineProps<{
  fontVariant?: TypographyVariant;
  fontWeight?: TypographyWeight;
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

const model = defineModel<string>({ default: '' });
const inputRef = useTemplateRef('input');
const typoAttrs = useTypographyAttrs(() => ({
  variant: props.fontVariant,
  weight: props.fontWeight,
}));

// Sometimes Telegram for iOS scrolls the input into view improperly. So,
// after the keyboard was shown, we are scrolling the input into view.
const onFocus = (e: FocusEvent) => {
  if (props.scrollIntoViewOnFocus) {
    setTimeout(() => {
      (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }
};

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
</script>

<template>
  <input
    ref="input"
    v-model="model"
    :class="['text-field-input-element', typoAttrs.classes]"
    placeholder=" "
    @focus="onFocus"
  >
</template>

<style lang="scss">
.text-field-input-element {
  appearance: none;
  background: none;
  border: none;
  outline: none;
  height: 100%;
  width: 100%;
  padding: 0;
  caret-color: var(---accent-text-color);
  color: inherit;
  @include mixins.hideScrollbar;
  @include mixins.noHighlight;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:not(&:placeholder-shown) + .text-field-input-placeholder {
    display: none;
  }
}
</style>
