<script setup lang="ts">
import type { StyleValue } from 'vue';

import type {
  UseTypographyAttrsOptions,
  UseTypographyAttrsAlign,
  UseTypographyAttrsWeight,
  UseTypographyAttrsVariant,
} from '~ui-kit/composables/useTypographyAttrs/useTypographyAttrs';

export type UseTypographyAlign = UseTypographyAttrsAlign;
export type UseTypographyVariant = UseTypographyAttrsVariant;
export type UseTypographyWeight = UseTypographyAttrsWeight;
export interface UseTypographyProps extends UseTypographyAttrsOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = defineProps<UseTypographyProps>();
defineSlots<{
  default(props: {
    classes?: unknown[];
    style?: StyleValue;
  }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const baseAttrs = useTypographyAttrs(() => props);
</script>

<template>
  <slot :classes="[$props.class, baseAttrs.classes]" :style="[style, baseAttrs.style]"/>
</template>
