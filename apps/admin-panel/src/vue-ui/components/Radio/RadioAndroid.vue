<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import { useTemplateRef, watch, type InputHTMLAttributes } from 'vue';
import { bem } from 'vue-ui';

export interface RadioAndroidProps extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'type' | 'onChange'> {
  class?: any;
  checked?: boolean;
  /**
   * True if haptic feedback should be applied on checked state changes.
   * @default true
   */
  haptic?: boolean;
}

export type RadioAndroidEmits = /* @vue-ignore */ {
  change: [Event & { target: HTMLInputElement }];
};

const { checked } = defineProps<RadioAndroidProps>();
defineEmits<RadioAndroidEmits>();
defineOptions({ inheritAttrs: false });

const rootRef = useTemplateRef<HTMLLabelElement>('root');
const innerRef = useTemplateRef<HTMLSpanElement>('inner');
let rootAnimation: Animation | undefined;
let innerAnimation: Animation | undefined;
const initiallyChecked = checked;

watch(() => checked, () => {
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
}, { immediate: false });

const [b, e] = bem('tgui-radio-android');
</script>

<template>
  <label
    ref="root"
    :class="[b({ checked }), $props.class]"
  >
    <input
      v-bind="$attrs"
      :class="e('input')"
      type="radio"
      :checked="checked"
      @change="haptic && hapticFeedbackSelectionChanged()"
    >
    <span
      ref="inner"
      :class="e('inner', { checked })"
    />
  </label>
</template>

<style scoped lang="scss">
@use "@/vue-ui/styles/mixins";

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

  &__input {
    display: none;
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
