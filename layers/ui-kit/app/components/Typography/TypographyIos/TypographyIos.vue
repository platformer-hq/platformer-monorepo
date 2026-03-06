<script setup lang="ts">
import type { KnownHtmlTag } from '@ui-kit/types';

import type {
  UseTypographyIosAlign,
  UseTypographyIosProps,
  UseTypographyIosVariant,
} from './UseTypographyIos.vue';

export type TypographyIosVariant = UseTypographyIosVariant;
export type TypographyIosAlign = UseTypographyIosAlign;
export interface TypographyIosProps extends UseTypographyIosProps {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const { as = 'p' } = defineProps<TypographyIosProps>();
const element = useTemplateRef('element');

defineExpose({ element });
</script>

<template>
  <UseTypographyIos v-slot="{classes, style}" v-bind="$props">
    <component
      :is="as"
      ref="element"
      v-bind="$attrs"
      :class="[$attrs.class, classes]"
      :style="[$attrs.style, style]"
    >
      <slot/>
    </component>
  </UseTypographyIos>
</template>
