<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
  type UseTypographyBaseOptions,
  type UseTypographyBaseAlign,
  useTypographyBase,
} from '@/composables/useTypographyBase/useTypographyBase';
import type { KnownHtmlTag } from '@/types';

export type TypographyBaseAlign = UseTypographyBaseAlign;
export interface TypographyBaseProps extends UseTypographyBaseOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyBaseProps>(), { as: 'p' });
const element = useTemplateRef('element');
const typography = useTypographyBase(props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="typography.classes" :style="typography.style">
    <slot/>
  </component>
</template>
