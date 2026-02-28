<script setup lang="ts">
import type { KnownHtmlTag } from '#layers/ui-kit';

import type {
  AutoUseTypographyProps,
  AutoUseTypographyVariant,
  AutoUseTypographyWeight,
} from './AutoUseTypography.vue';

export type AutoTypographyVariant = AutoUseTypographyVariant;
export type AutoTypographyWeight = AutoUseTypographyWeight;

export interface AutoTypographyProps extends AutoUseTypographyProps {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const { as = 'p' } = defineProps<AutoTypographyProps>();
const element = useTemplateRef('element');

defineExpose({ element });
</script>

<template>
  <AutoUseTypography v-slot="{classes, style}" v-bind="$props">
    <component
      :is="as"
      ref="element"
      v-bind="$attrs"
      :class="classes"
      :style="style"
    >
      <slot/>
    </component>
  </AutoUseTypography>
</template>
