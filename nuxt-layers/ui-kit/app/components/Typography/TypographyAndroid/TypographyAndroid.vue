<script setup lang="ts">
import type {
  UseTypographyAndroidOptions,
  UseTypographyAndroidAlign,
  UseTypographyAndroidVariant,
} from '~~/packages/ui-kit/src/composables/useTypographyAndroid/useTypographyAndroid';
import type { KnownHtmlTag } from '~~/packages/ui-kit/app/types';

export type TypographyAndroidAlign = UseTypographyAndroidAlign;
export type TypographyAndroidVariant = UseTypographyAndroidVariant;
export interface TypographyAndroidProps extends UseTypographyAndroidOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyAndroidProps>(), { as: 'p' });
const element = useTemplateRef('element');
const typography = useTypographyAndroid(props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="typography.classes" :style="typography.style">
    <slot/>
  </component>
</template>
