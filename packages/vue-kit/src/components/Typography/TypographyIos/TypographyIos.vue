<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';

import {
  type UseTypographyIosAttrsOptions,
  type UseTypographyIosAttrsVariant,
  type UseTypographyIosAttrsAlign,
  useTypographyIosAttrs,
} from './composables/useTypographyIosAttrs';

export type TypographyIosAlign = UseTypographyIosAttrsAlign;
export type TypographyIosVariant = UseTypographyIosAttrsVariant;
export interface TypographyIosProps extends UseTypographyIosAttrsOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyIosProps>(), { as: 'p' });
const element = useTemplateRef('element');
const baseAttrs = useTypographyIosAttrs(() => props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="baseAttrs.classes" :style="baseAttrs.style">
    <slot/>
  </component>
</template>
