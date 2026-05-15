<script setup lang="ts">
import {
  TextFieldAndroidInputElement,
  type TextFieldIosInputElementProps,
  TextFieldIosInputElement,
  type TextFieldAndroidInputElementProps,
} from '@tma.js/vue-kit';
import { reactiveOmit } from '@vueuse/core';

type FontVariant = (
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'callout'
  | 'subheadline1'
  | 'subheadline2'
  | 'footnote'
  | 'caption1'
  | 'caption2'
);

const props = defineProps<(
  & Omit<TextFieldAndroidInputElementProps & TextFieldIosInputElementProps, 'fontWeight' | 'fontVariant'>
  & {
    fontVariant?: FontVariant;
    fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  }
)>();

const platform = useTmaPlatform();
const sharedProps = reactiveOmit(props, ['fontVariant', 'fontWeight']);
</script>

<template>
  <TextFieldIosInputElement
    v-if="platform.isMappedIos"
    v-bind="sharedProps"
    :font-weight="fontWeight"
    :font-variant="fontVariant"
  >
    <slot/>
  </TextFieldIosInputElement>
  <TextFieldAndroidInputElement
    v-else
    v-bind="sharedProps"
    :font-variant="(
      fontVariant
      ? ({
        callout: 'subheadline1',
        footnote: 'caption1'
      } as {
        [Variant in FontVariant]?: Exclude<TextFieldAndroidInputElementProps['fontVariant'], undefined>
      })[fontVariant]
      : undefined
    ) || fontVariant"
    :font-weight="fontWeight ? ({
      regular: 'regular',
      medium: 'medium',
      semibold: 'medium',
      bold: 'medium',
    } as const)[fontWeight] : undefined"
  >
    <slot/>
  </TextFieldAndroidInputElement>
</template>
