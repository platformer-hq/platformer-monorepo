<script lang="ts" setup>
import { useMousePressed } from '@vueuse/core';
import { useTemplateRef, computed } from 'vue';

import { bem } from '@/utils/bem.js';

import ButtonBase, { type ButtonBaseProps } from './ButtonBase.vue';

export interface ButtonIosProps extends ButtonBaseProps {
  /**
   * True if the button is active. This value is used as a default value for
   * the `highlightOnActive` prop.
   */
  active?: boolean;
  /**
   * True if the button is visually elevated. Creates some kind of effect of liquid glass.
   */
  elevated?: boolean;
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

withDefaults(defineProps<ButtonIosProps>(), {
  variant: 'regular',
  highlightOnActive: undefined,
  active: undefined,
});

const rootRef = useTemplateRef('root');
const { pressed } = useMousePressed({ target: computed(() => rootRef.value?.element) });

const { b, e } = bem('tgui-button-ios');
</script>

<template>
  <ButtonBase
    ref="root"
    :as
    :palette
    :full-width
    :class="b({elevated, palette}, variant)"
  >
    <Transition v-if="highlightOnActive ?? active ?? true" :name="e('highlight')">
      <span v-if="pressed" key="active" :class="e('highlight')"/>
    </Transition>
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
.tgui-button-ios {
  position: relative;

  &--elevated {
    box-shadow: var(--tgui-elevated-box-shadow);
    backdrop-filter: blur(15px);
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

  &--small {
    padding: 4px 12px;
    min-height: 28px;
    border-radius: 1000px;
  }

  &__highlight {
    background: currentColor;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    opacity: 0.1;
    pointer-events: none;
    overflow: hidden;

    &-leave-active {
      transition: 300ms all;
    }

    &-leave-from {
      opacity: 0.1;
    }

    &-leave-to {
      opacity: 0;
    }
  }

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--tgui-button-ios-#{$palette}-bg-color);
      color: var(--tgui-button-ios-#{$palette}-text-color);
    }
  }
}
</style>
