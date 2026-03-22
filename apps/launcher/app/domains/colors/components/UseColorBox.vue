<script setup lang="ts">
import type { StyleValue } from 'vue';

import type { UseColorBoxOptions } from '../composables/useColorBox';

export type UseColorBoxAnyColor = UseColorBoxColor;

export interface UseColorBoxProps extends UseColorBoxOptions {
  style?: StyleValue;
}

const props = defineProps<UseColorBoxProps>();
defineSlots<{
  default(props: { style?: StyleValue }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const { style: colorBoxStyle } = useColorBox(props);
</script>

<template>
  <slot :style="[style, colorBoxStyle]"/>
</template>
