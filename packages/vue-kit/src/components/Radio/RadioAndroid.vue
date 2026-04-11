<script setup lang="ts" generic="T extends string | number | boolean">
import { hapticFeedback } from '@tma.js/sdk-vue';
import { computed, useTemplateRef, watch } from 'vue';

import { bem } from '@/utils/bem';

const props = defineProps<{
  value: T;
  disabled?: boolean;
}>();

const currentValue = defineModel<T>({ required: true });
const checked = computed(() => currentValue.value === props.value);
const initiallyChecked = checked.value;
const { b, e } = bem('tgui-radio-android');

const rootRef = useTemplateRef('root');
const innerRef = useTemplateRef('inner');
let rootAnimation: Animation | undefined;
let innerAnimation: Animation | undefined;

watch(checked, () => {
  if (!rootAnimation || !innerAnimation) {
    const uncheckedColor = 'var(--unchecked-color)';
    const checkedColor = 'var(--checked-color)';
    const animationOptions = {
      duration: 200,
      direction: initiallyChecked ? 'reverse' : 'normal',
      easing: 'linear',
      fill: 'both',
    } as const;
    rootAnimation = rootRef.value!.animate({
      transform: ['scale(1)', 'scale(0.8)', 'scale(1)'],
      padding: ['0px', '0px', '2px'],
      borderColor: [uncheckedColor, uncheckedColor, checkedColor],
    }, animationOptions);
    innerAnimation = innerRef.value!.animate({
      boxShadow: [
        `0 0 0 0 ${uncheckedColor} inset`,
        `0 0 0 8px ${uncheckedColor} inset`,
        `0 0 0 6px ${checkedColor} inset`,
      ],
      borderColor: [uncheckedColor, uncheckedColor, checkedColor],
    }, animationOptions);
  } else {
    rootAnimation.reverse();
    innerAnimation.reverse();
  }
});
</script>

<template>
  <label ref="root" :class="b({ checked })">
    <input
      v-show="false"
      v-model="currentValue"
      :value
      :disabled
      type="radio"
      @change="hapticFeedback.selectionChanged.ifAvailable()"
    >
    <span ref="inner" :class="e('inner', { checked })"/>
  </label>
</template>

<style lang="scss">
@use "@/scss/mixins";

.tgui-radio-android {
  --unchecked-color: var(--tgui-radio-android-color, #C8C7CC);
  --checked-color: var(--tgui-radio-android-checked-color, #007AFF);
  @include mixins.clickable;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--unchecked-color);
  position: relative;
  box-sizing: border-box;

  &--checked {
    padding: 2px;
    border-color: var(--checked-color);
  }

  &__inner {
    display: block;
    border-radius: 50%;
    height: 100%;

    &--checked {
      box-shadow: 0 0 0 6px var(--checked-color) inset;
    }
  }
}
</style>
