<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { type InputHTMLAttributes, mergeProps } from 'vue';

export interface ListIosItemBodyInputProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'placeholder'> {
  class?: unknown;
  /**
   * True if the clear button should be shown.
   * @default true
   */
  clear?: boolean;
  /**
   * True if it is allowed to have multiple lines.
   */
  multiline?: boolean;
  /**
   * Max rows allowed to display in multiline mode.
   */
  maxRows?: number;
}

export type ListIosItemBodyInputEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: To replace input with slot in future.
  clear = true,
} = defineProps<ListIosItemBodyInputProps>();
defineEmits<ListIosItemBodyInputEmits>();
defineOptions({ inheritAttrs: false });
defineSlots<{
  placeholder(): unknown;
}>();

const { b, e } = bem('list-ios-item-body-input');
const model = defineModel({ default: '' });
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input');
const keyboard = useKeyboardVisibility();

const textarea = computed(() => {
  return inputRef.value instanceof HTMLTextAreaElement ? inputRef.value : undefined;
});
useTextareaAutosize({ element: textarea, input: model });

// Both Telegram for iOS and Adnroid don't handle click outside and don't lose focus on
// the input.
onClickOutside(inputRef, () => {
  inputRef.value?.blur();
});

// Sometimes Telegram for iOS scrolls the input into view improperly. So,
// after the keyboard was shown, we are scrolling the input into view.
const onFocus = (e: FocusEvent) => {
  if (!keyboard.isShown) {
    // If the keyboard is not shown, then it is going to. It takes about 500 ms
    // for the keyboard to appear.
    setTimeout(() => {
      (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }
};
</script>

<template>
  <label :class="[b(), $props.class]">
    <UseTypographyIos v-slot="{classes, style}" :class="e('input')" variant="body">
      <component
        :is="multiline ? 'textarea' : 'input'"
        ref="input"
        v-bind="mergeProps($attrs, {class: classes, style})"
        :value="model"
        placeholder=" "
        :max-rows="multiline ? maxRows : undefined"
        @input="model = $event.target.value"
        @focus="onFocus"
      />
    </UseTypographyIos>
    <span v-if="$slots.placeholder" :class="e('placeholder')">
      <slot name="placeholder"/>
    </span>
    <i v-if="model && clear" :class="e('clear')" @click="model = ''">
      <IconXmarkFill28 :class="e('clear-icon')" />
    </i>
  </label>
</template>

<style lang="scss">
@use "@ui-kit-mixins" as mixins;

.list-ios-item-body-input {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;

  &__input {
    border: none;
    background: transparent;
    appearance: none;
    display: block;
    height: 100%;
    flex: 1 0 0;
    outline: none;
    position: relative;
    resize: none;
    padding: 15px 0;
    color: var(--list-ios-item-body-input-text-color);
    @include mixins.hideScrollbar;
    @include mixins.noHighlight;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:placeholder-shown + .list-ios-item-body-input__placeholder {
      display: block;
    }
  }

  &__placeholder {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  &__clear {
    flex: 0 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 5px;
    @include mixins.noHighlight;

    &-icon {
      width: 22px;
      color: var(--list-ios-item-body-input-clear-color);
    }
  }
}
</style>
