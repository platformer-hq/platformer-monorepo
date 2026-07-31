<script lang="ts" setup>
import type { ButtonBaseProps } from './ButtonBase.vue';

export interface ButtonIosProps extends ButtonBaseProps {
  /**
   * True if the button is active. This value is used as a default value for
   * the `highlightOnActive` prop.
   */
  active?: boolean;
  /**
   * True if the button should have effect of liquid glass.
   */
  glass?: boolean;
  /**
   * Highlights the button on activation.
   * @default Value of `active` prop if set. True otherwise.
   */
  highlightOnActive?: boolean;
  /**
   * Size variant.
   * @default 'regular'
   */
  variant?: 'regular' | 'small' | 'multiline';
}

const props = withDefaults(defineProps<ButtonIosProps>(), {
  variant: 'regular',
  clickable: undefined,
  highlightOnActive: undefined,
  active: undefined,
});

const basedOnActive = (key: 'highlightOnActive' | 'clickable') => {
  return props[key] ?? props.active ?? true;
};

const pressed = ref(false);

const { b } = bem('tgui-button-ios');
</script>

<template>
  <ButtonBase
    :as
    :clickable="basedOnActive('clickable')"
    :palette
    :full-width
    :class="b({glass, palette}, variant)"
    @pointerdown="pressed = true"
    @pointerup="pressed = false"
    @pointerleave="pressed = false"
    @pointercancel="pressed = false"
  >
    <IosActivationHighlight :show="basedOnActive('highlightOnActive') && pressed"/>
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
.tgui-button-ios {
  position: relative;

  &--glass {
    box-shadow: var(--glass-box-shadow);
    backdrop-filter: var(--glass-backdrop-filter);
  }

  &--regular {
    padding: 10px 24px;
    min-height: 50px;
    border-radius: 25px;
  }

  &--multiline {
    padding: 8px 24px;
    min-height: 62px;
    border-radius: 16px;
    display: grid;
    align-items: center;
    justify-content: center;
  }

  &--medium {
    padding: 4px 16px;
    min-height: 34px;
    border-radius: 1000px;
  }

  &--small {
    padding: 4px 12px;
    min-height: 28px;
    border-radius: 1000px;
  }

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--tgui-button-ios-#{$palette}-bg-color);
      color: var(--tgui-button-ios-#{$palette}-text-color);
    }
  }
}
</style>
