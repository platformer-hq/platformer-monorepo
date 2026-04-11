<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';

import {
  type UseTypographyBaseAttrsOptions,
  type UseTypographyBaseAttrsAlign,
  useTypographyBaseAttrs,
} from './composables/useTypographyBaseAttrs';

export type TypographyBaseAlign = UseTypographyBaseAttrsAlign;
export interface TypographyBaseProps extends UseTypographyBaseAttrsOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyBaseProps>(), { as: 'p' });
const element = useTemplateRef<HTMLElement>('element');
const baseAttrs = useTypographyBaseAttrs(() => props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="baseAttrs.classes" :style="baseAttrs.style">
    <slot/>
  </component>
</template>
