<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import type { InputHTMLAttributes } from 'vue';
import { bem, CheckmarkIOS28 } from 'vue-ui';

import { useActiveStateHandler } from '@/vue-ui/hooks/useActiveStateHandler';

export interface RadioIosProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'type' | 'onChange'> {
  class?: any;
  checked?: boolean;
  /**
   * True if haptic feedback should be applied on checked state changes.
   * @default true
   */
  haptic?: boolean;
}

export type RadioIosEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const { checked } = defineProps<RadioIosProps>();
defineEmits<RadioIosEmits>();
defineOptions({ inheritAttrs: false });

const [active, onPointerDown] = useActiveStateHandler();
const [b, e] = bem('tgui-radio-ios');
</script>

<template>
  <label
    :class="[b({ checked, active }), $props.class]"
    @pointerdown="onPointerDown"
  >
    <input
      v-bind="$attrs"
      :class="e('input')"
      type="radio"
      :checked="checked"
      @change="haptic && hapticFeedbackSelectionChanged()"
    >
    <CheckmarkIOS28
      :size="19"
      :class="e('icon', { checked })"
    />
  </label>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-radio-ios {
  @include mixins.clickable;
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--tgui-radio-ios-border-color, #C8C7CC);
  transition: 300ms ease;
  transition-property: transform, box-shadow;
  position: relative;
  box-sizing: border-box;
  --checked-color: var(--tgui-radio-ios-checked-color, #007AFF);

  &--checked {
    box-shadow: inset 0 0 0 11px var(--checked-color);
    border-color: var(--checked-color);
  }

  &--active {
    transform: scale(0.9);
  }

  &__input {
    display: none;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--tgui-radio-ios-icon-color, white);
    transition: stroke-dashoffset 300ms ease;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;

    &--checked {
      stroke-dashoffset: 78;
    }
  }
}
</style>
