<script setup lang="ts">
import { ref, type InputHTMLAttributes } from 'vue';
import { bem, Xmark24 } from 'vue-ui';

import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';

export interface ListAndroidItemBodyInputProps extends /* @vue-ignore */ InputHTMLAttributes {
  class?: any;
  type?: 'number' | 'text';
  /**
   * True if clear button should be shown.
   * @default true
   */
  clear?: boolean;
  placeholder?: string;
}

export type ListAndroidItemBodyInput = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const { type = 'text', clear = true } = defineProps<ListAndroidItemBodyInputProps>();
defineEmits<ListAndroidItemBodyInput>();
defineOptions({ inheritAttrs: false });

const [b, e] = bem('tgui-list-android-item-body-input');
const value = defineModel<string | number>('value', { required: true });
const focused = ref(false);
</script>

<template>
  <label :class="[b({ focused }), $props.class]">
    <TextAndroid
      v-if="value === '' && placeholder"
      :class="e('placeholder')"
      variant="body1"
    >
      {{ placeholder }}
    </TextAndroid>
    <input
      v-bind="$attrs"
      v-model="value"
      :class="e('input')"
      :type="type"
      @focus="focused = true"
      @blur="focused = false"
    >
    <i
      v-if="value && clear"
      :class="e('clear')"
      @click="value = ''"
    >
      <Xmark24 :class="e('clear-icon')" />
    </i>
  </label>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-list-android-item-body-input {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  margin-right: -20px;
  flex: 1;
  transition: box-shadow 200ms ease-in-out;

  &--focused {
    box-shadow: 0 -2px 0 var(--tgui-list-android-item-body-input-focused-border-color, #1C93E3) inset;
  }

  &--error {
    box-shadow: 0 -2px 0 var(--tgui-list-android-item-body-input-errored-border-color, #CC2929) inset;
  }

  &__input {
    @include mixins.no-highlight;
    border: none;
    background: transparent;
    appearance: none;
    display: block;
    height: 100%;
    flex: 1 0 0;
    padding: 0;
    outline: none;
    font-family: Roboto, "Segoe UI", "Helvetica Neue", sans-serif;
    font-size: 16px;
    line-height: 20px;
    color: var(--tgui-list-android-item-body-input-text-color, black);

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.8;
    color: var(--tgui-list-android-item-body-input-placeholder-color, #82868A);
    pointer-events: none;
    user-select: none;
  }

  &__clear {
    flex: 0 0 auto;
    height: 100%;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tgui-list-android-item-body-input-clear-color, #8E8E93);
    box-sizing: border-box;
    margin-left: 5px;
    @include mixins.clickable;

    &-icon {
      width: 22px;
    }
  }
}
</style>
