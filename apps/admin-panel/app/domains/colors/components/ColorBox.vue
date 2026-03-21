<script setup lang="ts">
import { useTemplateRef, type StyleValue } from 'vue';

import type { KnownHtmlTag } from '#layers/ui-kit';

import type { UseColorBoxProps } from './UseColorBox.vue';

export type ColorBoxAnyColor = UseColorBoxColor;

export interface ColorBoxProps extends UseColorBoxProps {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  style?: StyleValue;
}

const { as = 'div', ...props } = defineProps<ColorBoxProps>();
const { style: colorBoxStyle } = useColorBox(props);
const element = useTemplateRef<HTMLElement>('root');
defineExpose({ element });
</script>

<template>
  <component :is="as" ref="root" v-bind="$attrs" :style="[style, colorBoxStyle]">
    <slot/>
  </component>
</template>
