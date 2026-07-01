<script setup lang="ts">
import type {
  UseTypographyAndroidAttrsOptions,
  UseTypographyAndroidAttrsAlign,
  UseTypographyAndroidAttrsVariant,
  UseTypographyAndroidAttrsWeight,
} from '#ui-kit/composables/useTypographyAndroidAttrs/types';
import type { KnownHtmlTag } from '#ui-kit/types';

export type TypographyAndroidAlign = UseTypographyAndroidAttrsAlign;
export type TypographyAndroidVariant = UseTypographyAndroidAttrsVariant;
export type TypographyAndroidWeight = UseTypographyAndroidAttrsWeight;
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
