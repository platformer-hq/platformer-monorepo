<script setup lang="ts">
import type {
  UseTypographyBaseAttrsOptions,
  UseTypographyBaseAttrsAlign,
} from '#ui-kit/composables/useTypographyBaseAttrs/types';
import type { KnownHtmlTag } from '#ui-kit/types';

export type TypographyBaseAlign = UseTypographyBaseAttrsAlign;
export interface TypographyBaseProps extends UseTypographyBaseAttrsOptions {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<TypographyBaseProps>(), { as: 'p' });
const element = useTemplateRef<HTMLElement>('element');
const baseAttrs = useTypographyBaseAttrs(() => props);

defineExpose({ element });
</script>

<template>
  <component :is="as" ref="element" :class="baseAttrs.classes" :style="baseAttrs.style">
    <slot/>
  </component>
</template>
