<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import type { InputHTMLAttributes } from 'vue';
import { bem } from 'vue-ui';

export interface SwitchAndroidProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'type' | 'onChange'> {
  class?: any;
  checked?: boolean;
  disabled?: boolean;
  /**
   * True if haptic feedback should be applied on checked state changes.
   * @default true
   */
  haptic?: boolean;
}

export type SwitchAndroidEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const { haptic = true } = defineProps<SwitchAndroidProps>();
defineEmits<SwitchAndroidEmits>();
defineOptions({ inheritAttrs: false });

const [b, e] = bem('tgui-switch-android');
</script>

<template>
  <label :class="[b({ checked, disabled }), $props.class]">
    <input
      v-bind="$attrs"
      :disabled="disabled"
      :checked="checked"
      :class="e('input')"
      type="checkbox"
      @change="haptic && hapticFeedbackSelectionChanged()"
    >
    <span :class="e('thumb', { checked })" />
  </label>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-switch-android {
  appearance: none;
  display: inline-block;
  height: 14px;
  width: 32px;
  border-radius: 100px;
  background: var(--tgui-switch-android-bg, #A8A8A8);
  position: relative;
  transition: background 200ms ease;
  @include mixins.clickable;

  &--disabled {
    cursor: default;
  }

  &--checked {
    background: var(--tgui-switch-android-checked-bg, #50A8EB);
  }

  &__input {
    display: none;
  }

  &__thumb {
    position: absolute;
    left: -3px;
    top: -3px;
    border: 2px solid var(--tgui-switch-android-thumb-border-bg, #A8A8A8);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--tgui-switch-android-thumb-bg, white);
    transition: left 200ms ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &--checked {
      left: 14px;
      border-color: var(--tgui-switch-android-thumb-border-checked-bg, #50A8EB);;
    }
  }
}
</style>
