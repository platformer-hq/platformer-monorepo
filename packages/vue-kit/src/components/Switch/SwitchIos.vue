<script setup lang="ts">
import { hapticFeedback } from '@tma.js/sdk-vue';
import { useTemplateRef, watch } from 'vue';

import { bem } from '@/utils/bem';

defineProps<{
  disabled?: boolean;
}>();

const { b, e } = bem('tgui-switch-ios');
const checked = defineModel<boolean>('checked', { default: false });
const checkedInitially = checked.value;

const makeKeyframes = (checked: boolean): Keyframe[] => {
  const leftFrom = '2px';
  const leftTo = '23px';
  const leftDelta = '2px';
  const leftFromWithDelta = `calc(${leftFrom} - ${leftDelta})`;
  const leftToWithDelta = `calc(${leftTo} + ${leftDelta})`;
  const shared2080 = {
    transform: 'scale(1.4)',
    backgroundColor: 'rgba(255,255,255,.3)',
  };
  return [
    { offset: 0, left: checked ? leftFrom : leftTo },
    { offset: 0.1, left: checked ? leftFromWithDelta : leftToWithDelta },
    { offset: 0.2, ...shared2080 },
    { offset: 0.5, transform: 'scale(1.6)', backdropFilter: 'blur(2px) contrast(150%) brightness(150%)' },
    { offset: 0.8, ...shared2080 },
    { offset: 0.9, left: checked ? leftToWithDelta : leftFromWithDelta },
    { offset: 1, left: checked ? leftTo : leftFrom },
  ];
};

const knob = useTemplateRef('knob');
watch(checked, checked => {
  knob.value?.animate(
    makeKeyframes(checked),
    { duration: 350, easing: 'linear', fill: 'both' },
  );
});
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
    <span :class="e('mark', 'left', checked && 'visible')"/>
    <span :class="e('mark', 'right', !checked && 'visible')"/>
    <span
      ref="knob"
      :class="e('knob', { checked, 'checked-initially': checkedInitially })"
    />
  </label>
</template>

<style lang="scss">
@use "@/scss/mixins";

.tgui-switch-ios {
  display: inline-block;
  height: 28px;
  width: 64px;
  border-radius: 1000px;
  background: var(--tgui-switch-ios-bg, #747480);
  position: relative;
  transition: 350ms ease;
  @include mixins.clickable;

  &--disabled {
    cursor: default;
    opacity: 0.5;
  }

  &--checked {
    background: var(--tgui-switch-ios-checked-bg, #2FB250);
  }

  &__knob {
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 2px;
    width: 39px;
    border-radius: 1000px;
    transform-origin: center center;
    background: var(--tgui-switch-ios-knob-bg, white);
    box-shadow: var(--tgui-elevated-box-shadow);

    &--checked-initially {
      left: 23px;
    }
  }

  &__mark {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: 350ms ease-out;
    transition-delay: 100ms;

    &--left {
      left: 13px;
      width: 1px;
      height: 10px;
      background: var(--tgui-switch-ios-mark-left-color, black);
    }

    &--right {
      right: 8px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid var(--tgui-switch-ios-mark-right-color, rgba(255,255,255,.3));
    }

    &--visible {
      opacity: 1;
    }
  }
}
</style>
