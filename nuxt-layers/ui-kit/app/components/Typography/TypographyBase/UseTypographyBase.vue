<script setup lang="ts">
import type { UseTypographyBaseOptions } from '~~/packages/ui-kit/src/composables/useTypographyBase/useTypographyBase';
import type { StyleValue } from 'vue';

export interface UseTypographyBaseSlotProps {
  classes?: unknown[];
  style?: StyleValue;
}
export interface UseTypographyBaseProps extends UseTypographyBaseOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = withDefaults(defineProps<UseTypographyBaseProps>(), { maxLines: 'infinite' });
defineSlots<{
  default(props: UseTypographyBaseSlotProps): unknown;
}>();
defineOptions({ inheritAttrs: false });

const typography = useTypographyBase(props);
</script>

<template>
  <slot :classes="[$props.class, typography.classes]" :style="[style, typography.style]"/>
</template>
