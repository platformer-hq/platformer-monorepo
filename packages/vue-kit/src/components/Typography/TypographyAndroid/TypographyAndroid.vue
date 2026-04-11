<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';

import {
  type UseTypographyAndroidAttrsOptions,
  type UseTypographyAndroidAttrsAlign,
  type UseTypographyAndroidAttrsVariant,
  useTypographyAndroidAttrs,
} from './composables/useTypographyAndroidAttrs';

export type TypographyAndroidAlign = UseTypographyAndroidAttrsAlign;
export type TypographyAndroidVariant = UseTypographyAndroidAttrsVariant;
export interface TypographyAndroidProps extends UseTypographyAndroidAttrsOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyAndroidProps>(), { as: 'p' });
const element = useTemplateRef('element');
const baseAttrs = useTypographyAndroidAttrs(() => props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="baseAttrs.classes" :style="baseAttrs.style">
    <slot/>
  </component>
</template>
