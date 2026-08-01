<script setup lang="ts" generic="T extends string | number | boolean">
import { hapticFeedback } from '@tma.js/sdk-vue';
import { useMousePressed } from '@vueuse/core';

import { usePlatform } from '~/_composables/usePlatform';

const props = defineProps<{
  value: T;
  disabled?: boolean;
  palette?: 'pro';
}>();

const currentValue = defineModel<T>({ required: true });

const platform = usePlatform();
const rootRef = useTemplateRef('root');
const innerRef = useTemplateRef('inner');
const { pressed } = useMousePressed({ target: rootRef });

const checked = computed(() => currentValue.value === props.value);
const initiallyChecked = checked.value;
const { b, e } = bem('v-radio');

let androidRootAnimation: Animation | undefined;
let androidInnerAnimation: Animation | undefined;

watch(checked, () => {
  if (platform.value !== 'android') {
    return;
  }
  if (!androidRootAnimation || !androidInnerAnimation) {
    const uncheckedColor = 'var(--unchecked-color)';
    const checkedColor = 'var(--checked-color)';
    const animationOptions = {
      duration: 200,
      direction: initiallyChecked ? 'reverse' : 'normal',
      easing: 'linear',
      fill: 'both',
    } as const;
    androidRootAnimation = rootRef.value!.animate({
      transform: ['scale(1)', 'scale(0.8)', 'scale(1)'],
      padding: ['0px', '0px', '2px'],
      borderColor: [uncheckedColor, uncheckedColor, checkedColor],
    }, animationOptions);
    androidInnerAnimation = innerRef.value!.animate({
      boxShadow: [
        `0 0 0 0 ${uncheckedColor} inset`,
        `0 0 0 8px ${uncheckedColor} inset`,
        `0 0 0 6px ${checkedColor} inset`,
      ],
      borderColor: [uncheckedColor, uncheckedColor, checkedColor],
    }, animationOptions);
  } else {
    androidRootAnimation.reverse();
    androidInnerAnimation.reverse();
  }
});
</script>

<template>
  <label
    ref="root"
    :class="b(
      platform,
      !disabled && 'clickable',
      palette,
      checked && `${platform}-checked`,
      platform && {'ios-pressed': pressed}
    )"
  >
    <input
      v-show="false"
      v-model="currentValue"
      :value
      :disabled
      type="radio"
      @change="hapticFeedback.selectionChanged.ifAvailable()"
    >
    <span v-if="platform === 'android'" ref="inner" :class="e('android-inner', { checked })"/>
    <svg
      v-else
      :class="e('ios-icon', { checked })"
      width="19"
      height="19"
      viewBox="0 0 16 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 15.5L5.83176 20.7944C5.91474 20.8958 6.07258 20.8866 6.14322 20.7762L14 8.5"
        stroke="currentcolor"
        stroke-width="2.33"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </label>
</template>

<style lang="scss">
.v-radio {
  display: inline-block;
  border-radius: 50%;
  position: relative;
  --unchecked-color: var(--section-separator-color);
  --checked-color: var(--button-color);

  &--pro {
    --checked-color: var(--pro-accent);
  }

  &--clickable {
    @include mixins.clickable;
  }

  &--android {
    width: 20px;
    height: 20px;
    border: 2px solid var(--unchecked-color);

    &-checked {
      padding: 2px;
      border-color: var(--checked-color);
    }
  }

  &__android-inner {
    display: block;
    border-radius: 50%;
    height: 100%;

    &--checked {
      box-shadow: 0 0 0 6px var(--checked-color) inset;
    }
  }

  &--ios {
    width: 22px;
    height: 22px;
    box-shadow: inset 0 0 0 1.5px var(--section-separator-color);
    transition: 300ms ease;
    transition-property: transform, box-shadow;

    &-checked {
      box-shadow: inset 0 0 0 11px var(--checked-color);
      border-color: var(--checked-color);
    }

    &-pressed {
      transform: scale(0.9);
    }
  }

  &__ios-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--text-overlay);
    transition: stroke-dashoffset 300ms ease;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;

    &--checked {
      stroke-dashoffset: 78;
    }
  }
}
</style>
