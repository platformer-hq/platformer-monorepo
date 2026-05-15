<script lang="ts" setup>
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';
import { bem } from '@/utils/bem.js';

export interface ButtonBaseProps {
  /**
   * @default 'button'
   */
  as?: KnownHtmlTag;
  palette?: 'filled' | 'tinted' | 'plain' | 'gray' | 'disabled' | {
    /**
     * Background color.
     */
    bg?: string;
    /**
     * Text color.
     */
    text?: string;
  };
  /**
   * True if the button should take all available width.
   */
  fullWidth?: boolean;
}

withDefaults(defineProps<ButtonBaseProps>(), { as: 'button' });

const { b } = bem('tgui-button-base');
const root = useTemplateRef<HTMLElement>('root');

defineExpose({ element: root });
</script>

<template>
  <component
    :is="as"
    ref="root"
    :class="b({'full-width': fullWidth}, palette)"
    :style="typeof palette === 'object' ? {background: palette.bg, color: palette.text} : undefined"
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
  transition: 300ms ease-out;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @include mixins.noHighlight;

  &--full-width {
    width: 100%;
  }

  @each $palette in ('filled', 'tinted', 'plain', 'gray', 'disabled') {
    &--#{$palette} {
      background-color: var(--tgui-button-base-#{$palette}-bg-color);
      color: var(--tgui-button-base-#{$palette}-text-color);
    }
  }
}
</style>
