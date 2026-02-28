<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue';

export interface SwitchAndroidProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'type' | 'onChange'> {
  class?: unknown;
  checked?: boolean;
  disabled?: boolean;
}

export type SwitchAndroidEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

defineProps<SwitchAndroidProps>();
defineEmits<SwitchAndroidEmits>();
defineOptions({ inheritAttrs: false });

// FIXME: Model

const { b, e } = bem('switch-android');
</script>

<template>
  <label :class="[b({ checked, disabled }), $props.class]">
    <input
      v-bind="$attrs"
      :disabled="disabled"
      :checked="checked"
      :class="e('input')"
      type="checkbox"
    >
    <span :class="e('thumb', { checked })" />
  </label>
</template>

<style lang="scss">
.switch-android {
  appearance: none;
  display: inline-block;
  height: 14px;
  width: 32px;
  border-radius: 100px;
  background: var(--switch-android-bg, #A8A8A8);
  position: relative;
  transition: background 200ms ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &--disabled {
    cursor: default;
  }

  &--checked {
    background: var(--switch-android-checked-bg, #50A8EB);
  }

  &__input {
    display: none;
  }

  &__thumb {
    position: absolute;
    left: -3px;
    top: -3px;
    border: 2px solid var(--switch-android-thumb-border-bg, #A8A8A8);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--switch-android-thumb-bg, white);
    transition: left 200ms ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &--checked {
      left: 14px;
      border-color: var(--switch-android-thumb-border-checked-bg, #50A8EB);;
    }
  }
}
</style>
