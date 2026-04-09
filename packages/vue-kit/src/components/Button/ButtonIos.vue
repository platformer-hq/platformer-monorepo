<script lang="ts" setup>
import { useMousePressed } from '@vueuse/core';
import { useTemplateRef, computed } from 'vue';

import { bem } from '@/utils/bem.js';

import ButtonBase, { type ButtonBaseProps } from './ButtonBase.vue';

export interface ButtonIosProps extends ButtonBaseProps {
  /**
   * True if the button is active. This automatically enables or disables all "auto" properties
   * until the values are specified explicitly.
   */
  active?: boolean;
  /**
   * True if the button is clickable. This makes the button display cursor pointer.
   * @default True if `active` property is omitted or equal to `true`.
   */
  clickable?: boolean;
  /**
   * True if the button is visually elevated.
   */
  elevated?: boolean;
  /**
   * Highlights the button on activation.
   * @default True if `active` property is omitted or equal to `true`.
   */
  highlightOnActive?: boolean;
  /**
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

const { b, e } = bem('tgui-button-ios');

const basedOnActive = (key: 'highlightOnActive' | 'clickable') => {
  return props[key] ?? props.active ?? true;
};

const rootRef = useTemplateRef('root');
const { pressed } = useMousePressed({ target: computed(() => rootRef.value?.element) });
const onHighlightLeave = (el: Element, done: VoidFunction) => {
  el
    .animate({ opacity: [0.1, 0] }, { duration: 300 })
    .finished
    .then(() => {
      done();
    });
};
</script>

<template>
  <ButtonBase
    ref="root"
    :as
    :clickable="basedOnActive('clickable')"
    :palette
    :full-width
    :class="b({elevated, palette}, variant)"
  >
    <Transition
      v-if="basedOnActive('highlightOnActive')"
      :css="false"
      @leave="onHighlightLeave"
    >
      <span v-if="pressed" key="active" :class="e('highlight')"/>
    </Transition>
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
.tgui-button-ios {
  position: relative;

  &--elevated {
    // TODO: Unknown variable for the layer.
    box-shadow: var(--elevated-box-shadow);
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
  }

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--tgui-button-ios-#{$palette}-bg-color);
      color: var(--tgui-button-ios-#{$palette}-text-color);
    }
  }
}
</style>
