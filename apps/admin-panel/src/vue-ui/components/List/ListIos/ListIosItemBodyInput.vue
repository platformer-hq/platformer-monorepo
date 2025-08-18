<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue';
import { bem, XmarkFill28 } from 'vue-ui';

import TextIos from '@/vue-ui/components/Text/TextIos.vue';

export interface ListIosItemBodyInputProps extends /* @vue-ignore */ InputHTMLAttributes {
  class?: any;
  type?: 'number' | 'text';
  /**
   * True if clear button should be shown.
   * @default true
   */
  clear?: boolean;
  placeholder?: string;
}

export type ListIosItemBodyInput = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const { type = 'text', clear = true } = defineProps<ListIosItemBodyInputProps>();
defineEmits<ListIosItemBodyInput>();
defineOptions({ inheritAttrs: false });

const [b, e] = bem('tgui-list-ios-item-body-input');
const value = defineModel<string | number>('value', { required: true });
</script>

<template>
  <label :class="[b(), $props.class]">
    <TextIos
      v-if="value === '' && placeholder"
      :class="e('placeholder')"
    >
      {{ placeholder }}
    </TextIos>
    <input
      v-bind="$attrs"
      v-model="value"
      :class="e('input')"
      :type="type"
    >
    <i
      v-if="value && clear"
      :class="e('clear')"
      @click="value = ''"
    >
      <XmarkFill28 :class="e('clear-icon')" />
    </i>
  </label>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-list-ios-item-body-input {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;

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
    font-family: SF Pro, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 17px;
    line-height: 22px;
    color: var(--tgui-list-ios-item-body-input-text-color, black);

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
    color: var(--tgui-list-ios-item-body-input-placeholder-color, #8E8E93);
    pointer-events: none;
    user-select: none;
  }

  &__clear {
    flex: 0 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    color: var(--tgui-list-ios-item-body-input-clear-color, #8E8E93);
    box-sizing: border-box;
    padding-left: 5px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &-icon {
      width: 22px;
    }
  }
}
</style>
