<script setup lang="ts">
import type {
  UseTypographyBaseOptions,
  UseTypographyBaseAlign,
} from '~~/packages/ui-kit/src/composables/useTypographyBase/useTypographyBase';
import type { KnownHtmlTag } from '~~/packages/ui-kit/app/types';

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
