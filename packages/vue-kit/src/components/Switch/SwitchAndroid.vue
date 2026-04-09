<script setup lang="ts">
import { hapticFeedback } from '@tma.js/sdk-vue';

import { bem } from '@/utils/bem';

defineProps<{
  disabled?: boolean;
}>();

const { b, e } = bem('switch-android');
const checked = defineModel<boolean>('checked', { default: false });
</script>

<template>
  <label :class="b({ checked, disabled })">
    <input
      v-show="false"
      v-model="checked"
      :disabled
      type="checkbox"
      @change="hapticFeedback.selectionChanged.ifAvailable()"
    >
    <span :class="e('track', {checked})"/>
    <span :class="e('knob', {checked})" />
  </label>
</template>

<style lang="scss">
@use "@/scss/mixins";

.switch-android {
  display: inline-block;
  height: 16px;
  width: 32px;
  position: relative;
  transition: 300ms;
  @include mixins.clickable;

  &--disabled {
    cursor: default;
    opacity: 0.5;
  }

  &__track {
    display: block;
    height: 100%;
    width: 100%;
    border-radius: 100px;
    background: var(--switch-android-bg, #A8A8A8);
    transition: 300ms;
    mask-image: radial-gradient(circle 9px, transparent 100%, black 100%);
    mask-size: 300% 100%;
    mask-repeat: no-repeat;
    mask-position: -39.5px center;

    &--checked {
      background: var(--switch-android-checked-bg, #50A8EB);
      mask-position: -23px center;
    }
  }

  &__knob {
    position: absolute;
    left: -1px;
    top: -1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    outline: 2px solid var(--switch-android-knob-color, #A8A8A8);
    transition: left 300ms;

    &--checked {
      left: 17px;
      outline-color: var(--switch-android-knob-checked-color, #50A8EB);
    }
  }
}
</style>
