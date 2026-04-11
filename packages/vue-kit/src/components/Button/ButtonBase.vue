<script lang="ts" setup>
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';
import { bem } from '@/utils/bem.js';

export interface ButtonBaseProps {
  /**
   * @default 'button'
   */
  as?: KnownHtmlTag;
  palette?: 'filled' | 'tinted' | 'plain' | 'gray' | 'disabled';
  /**
   * True if the button should take all available width.
   */
  fullWidth?: boolean;
  /**
   * True if the button is clickable. This makes the button display cursor pointer.
   * @default true
   */
  clickable?: boolean;
}

const { as = 'button', clickable = true } = defineProps<ButtonBaseProps>();

const { b } = bem('tgui-button-base');
const root = useTemplateRef<HTMLElement>('root');

defineExpose({ element: root });
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="b({'full-width': fullWidth, clickable}, palette)"
  >
    <slot/>
  </component>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.tgui-button-base {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  transition: 200ms ease-out;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @include mixins.noHighlight;

  &--full-width {
    width: 100%;
  }

  &--clickable {
    @include mixins.clickable;
  }

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--tgui-button-base-#{$palette}-bg-color);
      color: var(--tgui-button-base-#{$palette}-text-color);
    }
  }
}
</style>
