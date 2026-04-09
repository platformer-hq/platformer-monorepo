<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
  type UseTypographyAndroidOptions,
  type UseTypographyAndroidAlign,
  type UseTypographyAndroidVariant,
  useTypographyAndroid,
} from '@/composables/useTypographyAndroid/useTypographyAndroid';
import type { KnownHtmlTag } from '@/types';

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
