<script lang="ts" setup>
import { useMousePressed } from '@vueuse/core';
import { useTemplateRef, computed } from 'vue';

import IosActivationHighlight from '@/components/IosActivationHighlight.vue';
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

const { b } = bem('tgui-button-ios');
</script>

<template>
  <ButtonBase
    ref="root"
    :as
    :palette
    :full-width
    :class="b({elevated, palette}, variant)"
  >
    <IosActivationHighlight v-if="highlightOnActive ?? active ?? true" :show="pressed"/>
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

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--tgui-button-ios-#{$palette}-bg-color);
      color: var(--tgui-button-ios-#{$palette}-text-color);
    }
  }
}
</style>
