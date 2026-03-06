<script setup lang="ts">
import type { UseTypographyIosOptions } from '@ui-kit/composables/useTypographyIos/useTypographyIos';
import type { StyleValue } from 'vue';

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
