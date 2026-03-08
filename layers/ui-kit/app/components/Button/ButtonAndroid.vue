<script lang="ts" setup>
import { useMousePressed } from '@vueuse/core';

import ButtonBase, { type ButtonBaseProps } from './ButtonBase.vue';

export interface ButtonAndroidProps extends ButtonBaseProps {
  /**
   * True if the button is active. This value is used as a default for `pressable`, `ripples`
   * and `clickable` properties.
   */
  active?: boolean;
  /**
   * True if the button is clickable. This makes the button display cursor pointer.
   * @default True if `active` property is omitted or equal to `true`.
   */
  clickable?: boolean;
  /**
   * Scales down the button on activation.
   * @default True if `active` property is omitted or equal to `true`.
   */
  pressable?: boolean;
  /**
   * Adds ripples on touch.
   * @default True if `active` property is omitted or equal to `true`.
   */
  ripples?: boolean;
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'small' | 'multiline';
}

const props = withDefaults(defineProps<ButtonAndroidProps>(), {
  variant: 'regular',
  pressable: undefined,
  ripples: undefined,
  clickable: undefined,
  active: undefined,
});

const { b } = bem('button-android');

const basedOnActive = (key: 'ripples' | 'pressable' | 'clickable') => {
  return props[key] ?? props.active ?? true;
};
const rootRef = useTemplateRef('root');
const pressed = ref(false);
useMousePressed({
  target: () => rootRef.value?.element,
  onPressed() {
    if (basedOnActive('pressable')) {
      pressed.value = true;
    }
  },
  onReleased() {
    pressed.value = false;
  },
});

const ripplesRef = computed(() => rootRef.value?.element);
useRipples({
  enabled: () => basedOnActive('ripples'),
  containerRef: ripplesRef,
  clickRef: ripplesRef,
});
</script>

<template>
  <ButtonBase
    ref="root"
    :as
    :clickable="basedOnActive('clickable')"
    :palette
    :full-width
    :class="b({pressed, palette}, variant)"
  >
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
@use "@ui-kit/scss/mixins" as mixins;

.button-android {
  position: relative;
  overflow: hidden;
  transition: 300ms ease-out;

  &--pressed {
    transform: scale(0.95);
  }

  &--regular {
    padding: 12px 30px 12px 24px;
    min-height: 48px;
    border-radius: 28px;
  }

  &--multiline {
    padding: 7px 24px 8px;
    min-height: 58px;
    border-radius: 16px;
    display: grid;
    align-items: center;
    justify-content: center;
  }

  &--small {
    padding: 6px 12px;
    min-height: 28px;
    border-radius: 1000px;
  }

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--button-android-#{$palette}-bg-color);
      color: var(--button-android-#{$palette}-text-color);
    }
  }
}
</style>
