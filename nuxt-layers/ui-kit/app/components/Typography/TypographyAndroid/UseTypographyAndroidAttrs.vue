<script setup lang="ts">
import type { StyleValue } from 'vue';

import type {
  UseTypographyAndroidAttrsOptions,
} from '#ui-kit/composables/useTypographyAndroidAttrs/types';

export interface UseTypographyAndroidAttrsProps extends UseTypographyAndroidAttrsOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = defineProps<UseTypographyAndroidAttrsProps>();
defineSlots<{
  default(props: {
    classes?: unknown[];
    style?: StyleValue;
  }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const baseAttrs = useTypographyAndroidAttrs(props);
</script>

<template>
  <slot :classes="[$props.class, baseAttrs.classes]" :style="[style, baseAttrs.style]"/>
</template>
