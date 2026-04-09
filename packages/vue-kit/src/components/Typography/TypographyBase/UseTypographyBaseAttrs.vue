<script setup lang="ts">
import type { StyleValue } from 'vue';

import {
  useTypographyBaseAttrs,
  type UseTypographyBaseAttrsOptions,
} from './useTypographyBaseAttrs';

export interface UseTypographyBaseAttrsProps extends UseTypographyBaseAttrsOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = defineProps<UseTypographyBaseAttrsProps>();
defineSlots<{
  default(props: {
    classes?: unknown[];
    style?: StyleValue;
  }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const baseAttrs = useTypographyBaseAttrs(() => props);
</script>

<template>
  <slot :classes="[$props.class, baseAttrs.classes]" :style="[style, baseAttrs.style]"/>
</template>
