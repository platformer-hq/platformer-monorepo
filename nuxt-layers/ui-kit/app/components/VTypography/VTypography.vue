<script setup lang="ts">
import type {
  UseTypographyAttrsOptions,
  UseTypographyAttrsAlign,
  UseTypographyAttrsWeight,
  UseTypographyAttrsVariant,
} from '~/composables/useTypographyAttrs/useTypographyAttrs';
import type { KnownHtmlTag } from '~/types';

export type TypographyAlign = UseTypographyAttrsAlign;
export type TypographyVariant = UseTypographyAttrsVariant;
export type TypographyWeight = UseTypographyAttrsWeight;
export interface TypographyProps extends UseTypographyAttrsOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyProps>(), { as: 'p' });
const element = useTemplateRef<HTMLElement>('element');
const baseAttrs = useTypographyAttrs(() => props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="baseAttrs.classes" :style="baseAttrs.style">
    <slot/>
  </component>
</template>
