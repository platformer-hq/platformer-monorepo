<script setup lang="ts">
import type {
  UseTypographyIosAttrsOptions,
  UseTypographyIosAttrsVariant,
  UseTypographyIosAttrsAlign,
  UseTypographyIosAttrsWeight,
} from '#ui-kit/composables/useTypographyIosAttrs/types';
import type { KnownHtmlTag } from '#ui-kit/types';

export type TypographyIosAlign = UseTypographyIosAttrsAlign;
export type TypographyIosVariant = UseTypographyIosAttrsVariant;
export type TypographyIosWeight = UseTypographyIosAttrsWeight;
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
