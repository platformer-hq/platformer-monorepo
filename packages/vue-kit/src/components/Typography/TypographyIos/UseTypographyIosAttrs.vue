<script setup lang="ts">
import type { StyleValue } from 'vue';

import {
  useTypographyIosAttrs,
  type UseTypographyIosAttrsOptions,
} from './useTypographyIosAttrs';

export interface UseTypographyIosAttrsProps extends UseTypographyIosAttrsOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = defineProps<UseTypographyIosAttrsProps>();
defineSlots<{
  default(props: {
    classes?: unknown[];
    style?: StyleValue;
  }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const baseAttrs = useTypographyIosAttrs(props);
</script>

<template>
  <slot :classes="[$props.class, baseAttrs.classes]" :style="[style, baseAttrs.style]"/>
</template>
