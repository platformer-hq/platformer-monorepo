<script setup lang="ts">
import type { KnownHtmlTag } from '@ui-kit/types';

import type {
  UseTypographyBaseAlign,
  UseTypographyBaseProps,
} from './UseTypographyBase.vue';

export type TypographyBaseAlign = UseTypographyBaseAlign;
export interface TypographyBaseProps extends UseTypographyBaseProps {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const { as = 'p' } = defineProps<TypographyBaseProps>();
const element = useTemplateRef('element');

defineExpose({ element });
</script>

<template>
  <UseTypographyBase v-slot="{classes, style}" v-bind="$props">
    <component
      :is="as"
      ref="element"
      v-bind="$attrs"
      :class="classes"
      :style="style"
    >
      <slot/>
    </component>
  </UseTypographyBase>
</template>
