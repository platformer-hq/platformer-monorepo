<script setup lang="ts">
import type { StyleValue } from 'vue';

import { useTypographyAndroid, type UseTypographyAndroidOptions } from '@/composables/useTypographyAndroid/useTypographyAndroid';

export interface UseTypographyAndroidSlotProps {
  classes?: unknown[];
  style?: StyleValue;
}
export interface UseTypographyAndroidProps extends UseTypographyAndroidOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = withDefaults(defineProps<UseTypographyAndroidProps>(), { maxLines: 'infinite' });
defineSlots<{
  default(props: UseTypographyAndroidSlotProps): unknown;
}>();
defineOptions({ inheritAttrs: false });

const typography = useTypographyAndroid(props);
</script>

<template>
  <slot :classes="[$props.class, typography.classes]" :style="[style, typography.style]"/>
</template>
