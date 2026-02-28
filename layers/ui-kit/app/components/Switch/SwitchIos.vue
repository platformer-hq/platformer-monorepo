<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue';

import { IconCheckmarkIOS28, IconXmark24 } from '#components';

export interface SwitchIosProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'type' | 'onChange'> {
  /**
   * Should icons inside the thumb be displayed. Enabling this mode will also slightly modify
   * the switch colors.
   */
  iconed?: boolean;
  class?: unknown;
  checked?: boolean;
  disabled?: boolean;
}

export type SwitchIosEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

defineProps<SwitchIosProps>();
defineEmits<SwitchIosEmits>();
defineOptions({ inheritAttrs: false });

// FIXME: Model

const { b, e } = bem('switch-ios');
</script>

<template>
  <label :class="[b({ checked, disabled, iconed }), $props.class]">
    <input
      v-bind="$attrs"
      :disabled="disabled"
      :checked="checked"
      :class="e('input')"
      type="checkbox"
    >
    <span :class="e('thumb', { checked })">
      <template v-if="iconed">
        <component
          :is="checked ? IconCheckmarkIOS28 : IconXmark24"
          width="auto"
          height="20"
        />
      </template>
    </span>
  </label>
</template>

<style lang="scss">
.switch-ios {
  appearance: none;
  display: inline-block;
  height: 31px;
  width: 51px;
  border-radius: 16px;
  background: var(--switch-ios-bg, #78788029);
  position: relative;
  transition: background 200ms ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &--disabled {
    cursor: default;
  }

  &--iconed {
    background: var(--switch-ios-iconed-bg, #FF3B30);
  }

  &--checked {
    background: var(--switch-ios-checked-bg, #34C759);
  }

  &__input {
    display: none;
  }

  &__thumb {
    position: absolute;
    left: 2px;
    top: 2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: var(--switch-ios-thumb-bg, white);
    transition: left 200ms ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &--checked {
      left: 22px;
    }
  }

  &__check-icon {
    display: block;
    color: var(--switch-ios-check-icon-color, #34C759);
  }

  &__uncheck-icon {
    display: block;
    color: var(--switch-ios-uncheck-icon-color, #FF3B30);
  }
}
</style>
