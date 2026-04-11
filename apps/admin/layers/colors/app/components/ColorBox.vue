<script setup lang="ts">
import type { KnownHtmlTag } from '@tma.js/vue-kit';
import { useTemplateRef, type StyleValue } from 'vue';

import type { UseColorBoxProps, UseColorBoxColor } from './UseColorBox.vue';

export type ColorBoxColor = UseColorBoxColor;

export interface ColorBoxProps extends UseColorBoxProps {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  style?: StyleValue;
}

const { as = 'div', ...props } = defineProps<ColorBoxProps>();
const { style: colorBoxStyle } = useColorBoxAttrs(() => props);
const element = useTemplateRef<HTMLElement>('root');
defineExpose({ element });
</script>

<template>
  <component :is="as" ref="root" :style="[style, colorBoxStyle]">
    <slot/>
  </component>
</template>
