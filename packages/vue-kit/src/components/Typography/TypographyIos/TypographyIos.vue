<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
  type UseTypographyIosOptions,
  type UseTypographyIosVariant,
  type UseTypographyIosAlign,
  useTypographyIos,
} from '@/composables/useTypographyIos/useTypographyIos';
import type { KnownHtmlTag } from '@/types';

export type TypographyIosAlign = UseTypographyIosAlign;
export type TypographyIosVariant = UseTypographyIosVariant;
export interface TypographyIosProps extends UseTypographyIosOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyIosProps>(), { as: 'p' });
const element = useTemplateRef('element');
const typography = useTypographyIos(props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="typography.classes" :style="typography.style">
    <slot/>
  </component>
</template>
