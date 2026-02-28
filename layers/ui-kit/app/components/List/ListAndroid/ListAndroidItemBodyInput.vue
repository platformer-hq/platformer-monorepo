<script setup lang="ts">
import { onClickOutside, useTextareaAutosize } from '@vueuse/core';
import { type InputHTMLAttributes, mergeProps } from 'vue';

export interface ListAndroidItemBodyInputProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'placeholder'> {
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

export type ListAndroidItemBodyInputEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: To replace input with slot in future.
  clear = true,
} = defineProps<ListAndroidItemBodyInputProps>();
defineEmits<ListAndroidItemBodyInputEmits>();
defineOptions({ inheritAttrs: false });
defineSlots<{
  placeholder(): unknown;
}>();

const { b, e } = bem('list-android-item-body-input');
const model = defineModel<string>({ default: '' });
const focused = ref(false);
const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>('input');

const textarea = computed(() => {
  return inputRef.value instanceof HTMLTextAreaElement ? inputRef.value : undefined;
});
useTextareaAutosize({ element: textarea, input: model });

// Telegram for Android doesn't handle click outside and doesn't lose focus on the input.
onClickOutside(inputRef, () => {
  inputRef.value?.blur();
});
</script>

<template>
  <label :class="[b({ focused }), $props.class]">
    <UseTypographyAndroid v-slot="{classes, style}" :class="e('input')" variant="body1">
      <component
        :is="multiline ? 'textarea' : 'input'"
        ref="input"
        v-bind="mergeProps($attrs, {class: classes, style})"
        placeholder=" "
        :value="model"
        :max-rows="multiline ? maxRows : undefined"
        @input="model = $event.target.value"
        @focus="focused = true"
        @blur="focused = false"
      />
    </UseTypographyAndroid>
    <span v-if="$slots.placeholder" :class="e('placeholder')">
      <slot name="placeholder"/>
    </span>
    <i
      v-if="model && clear"
      :class="e('clear')"
      @click="model = ''"
    >
      <IconXmark24 :class="e('clear-icon')" />
  </i>
  </label>
</template>

<style lang="scss">
@use "@/domains/styles/mixins";

.list-android-item-body-input {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  margin-right: -20px;
  padding-right: 20px;
  flex: 1;
  transition: box-shadow 200ms ease-in-out;

  &--focused {
    box-shadow: 0 -2px 0 var(--accent-text-color, #1C93E3) inset;
  }

  &--error {
    box-shadow: 0 -2px 0 var(--destructive-text-color, #CC2929) inset;
  }

  &__input {
    border: none;
    background: transparent;
    appearance: none;
    display: block;
    flex: 1 0 0;
    outline: none;
    position: relative;
    resize: none;
    padding: 15px 0;
    color: var(--list-android-item-body-input-text-color);
    @include mixins.hideScrollbar;
    @include mixins.noHighlight;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:placeholder-shown + .list-android-item-body-input__placeholder {
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
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--list-android-item-body-input-clear-color, #8E8E93);
    box-sizing: border-box;
    margin-left: 5px;
    @include mixins.clickable;

    &-icon {
      width: 22px;
    }
  }
}
</style>
