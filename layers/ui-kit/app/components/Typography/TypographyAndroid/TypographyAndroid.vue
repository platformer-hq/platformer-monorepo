<script setup lang="ts">
import type {
  UseTypographyAndroidAlign,
  UseTypographyAndroidProps,
  UseTypographyAndroidVariant,
} from './UseTypographyAndroid.vue';

export type TypographyAndroidVariant = UseTypographyAndroidVariant;
export type TypographyAndroidAlign = UseTypographyAndroidAlign;
export interface TypographyAndroidProps extends UseTypographyAndroidProps {
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
}

const { as = 'p' } = defineProps<TypographyAndroidProps>();
const element = useTemplateRef('element');

defineExpose({ element });
</script>

<template>
  <UseTypographyAndroid v-slot="{classes, style}" v-bind="$props">
    <component
      :is="as"
      ref="element"
      v-bind="$attrs"
      :class="[$attrs.class, classes]"
      :style="[$attrs.style, style]"
    >
      <slot/>
    </component>
  </UseTypographyAndroid>
</template>
