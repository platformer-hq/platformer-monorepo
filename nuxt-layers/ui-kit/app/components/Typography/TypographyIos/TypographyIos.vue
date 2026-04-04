<script setup lang="ts">
import type { KnownHtmlTag } from '~~/packages/ui-kit/app/types';
import type {
  UseTypographyIosOptions,
  UseTypographyIosVariant,
  UseTypographyIosAlign,
} from '~~/packages/ui-kit/src/composables/useTypographyIos/useTypographyIos';

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
