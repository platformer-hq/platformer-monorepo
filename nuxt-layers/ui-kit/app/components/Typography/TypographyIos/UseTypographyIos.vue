<script setup lang="ts">
import type { StyleValue } from 'vue';

import type { UseTypographyIosOptions } from '~~/packages/ui-kit/src/composables/useTypographyIos/useTypographyIos';

export interface UseTypographyIosSlotProps {
  classes?: unknown[];
  style?: StyleValue;
}
export interface UseTypographyIosProps extends UseTypographyIosOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = withDefaults(defineProps<UseTypographyIosProps>(), { maxLines: 'infinite' });
defineSlots<{
  default(props: UseTypographyIosSlotProps): unknown;
}>();
defineOptions({ inheritAttrs: false });

const typography = useTypographyIos(props);
</script>

<template>
  <slot :classes="[$props.class, typography.classes]" :style="[style, typography.style]"/>
</template>
