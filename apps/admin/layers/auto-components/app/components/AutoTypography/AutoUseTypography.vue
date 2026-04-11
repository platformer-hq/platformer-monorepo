<script setup lang="ts">
import { UseTypographyAndroid, UseTypographyIos } from '@tma.js/vue-kit';
import type { UseTypographyBaseProps } from '@tma.js/vue-kit';
import { mergeProps, type StyleValue } from 'vue';

import type { ColorReferenceAnyColor } from '#colors/utils/utils';

export type AutoUseTypographyVariant =
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'callout'
  | 'subheadline1'
  | 'subheadline2'
  | 'footnote'
  | 'caption1'
  | 'caption2';
export type AutoUseTypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface AutoUseTypographyProps extends UseTypographyBaseProps {
  variant?: AutoUseTypographyVariant;
  weight?: AutoUseTypographyWeight;
  rounded?: boolean;
  color?: ColorReferenceAnyColor;
}

const platform = useTmaPlatform();
const root = useTemplateRef('root');

const props = defineProps<AutoUseTypographyProps>();
defineSlots<{
  default(props: {
    classes?: unknown[];
    style: StyleValue;
  }): unknown;
}>();
defineExpose({ element: root });
defineOptions({ inheritAttrs: false });

const rootProps = computed(() => {
  if (platform.value.isMappedIos) {
    return props;
  }
  const { variant, weight } = props;
  return mergeProps(props, {
    variant: variant
      ? ({ callout: 'subheadline1', footnote: 'caption1' } as {
        [Variant in AutoUseTypographyVariant]?: AutoUseTypographyVariant
      })[variant] || variant
      : undefined,
    weight: weight
      ? ({
        regular: 'regular',
        medium: 'medium',
        semibold: 'medium',
        bold: 'medium',
      } as const)[weight]
      : undefined,
  });
});
</script>

<template>
  <component
    :is="platform?.isMappedIos ? UseTypographyIos : UseTypographyAndroid"
    ref="root"
    v-slot="{classes, style}"
    v-bind="rootProps"
  >
    <slot
      :classes="classes"
      :style="[style, {color: colorReference(color) || undefined}]"
    />
  </component>
</template>
