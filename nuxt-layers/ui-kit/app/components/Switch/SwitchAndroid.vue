<script setup lang="ts">
import { hapticFeedback } from '@tma.js/sdk-vue';

defineProps<{
  disabled?: boolean;
}>();

const checked = defineModel<boolean>('checked', { default: false });

const { b, e } = bem('switch-android');
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
    background: var(--hint-color);
    transition: 300ms;
    mask-image: radial-gradient(circle 9px, transparent 100%, black 100%);
    mask-size: 300% 100%;
    mask-repeat: no-repeat;
    mask-position: -39.5px center;

    &--checked {
      background: var(--button-color);
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
    outline: 2px solid var(--hint-color);
    transition: left 300ms;

    &--checked {
      left: 17px;
      outline-color: var(--button-color);
    }
  }
}
</style>
