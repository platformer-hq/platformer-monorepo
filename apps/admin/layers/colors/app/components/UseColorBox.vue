<script setup lang="ts">
import type { StyleValue } from 'vue';

import type { UseColorBoxAttrsOptions, UseColorBoxAttrsColor } from '../composables/useColorBoxAttrs';

export type UseColorBoxColor = UseColorBoxAttrsColor;

export interface UseColorBoxProps extends UseColorBoxAttrsOptions {
  style?: StyleValue;
}

const props = defineProps<UseColorBoxProps>();
defineSlots<{
  default(props: { style?: StyleValue }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const { style: colorBoxStyle } = useColorBoxAttrs(() => props);
</script>

<template>
  <slot :style="[style, colorBoxStyle]"/>
</template>
