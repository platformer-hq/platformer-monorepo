<script setup lang="ts">
import type { UseTypographyIosOptions } from '@ui-kit/composables/useTypographyIos/useTypographyIos';
import type { KnownHtmlTag } from '@ui-kit/types';

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
