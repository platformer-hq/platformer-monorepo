<script lang="ts" setup>
/**
 * This component is reponsible for displaying a block, notifying the user that the content
 * is loading.
 */
import type { KnownHtmlTag } from '@workspace/ui-kit';

import type { AutoTypographyVariant } from '~/auto-components/AutoTypography/AutoTypography.vue';

const { borderRadius = 5, as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  /**
   * Color to apply to the shimmer background.
   * @default 'quaternary'
   */
  color?: 'tertiary' | 'quaternary' | 'transparent';
  /**
   * True if the shimmer should have max-rounded corners.
   */
  rounded?: boolean;
  width?: string | number;
  borderRadius?: string | number;
  margin?: string | number;
  variant: AutoTypographyVariant;
  display?: string;
}>();

const { b, e } = bem('text-shimmer-box');
</script>

<template>
  <component
    :is="as"
    :class="b()"
    :style="{margin: toPx(margin), width: toPx(width), display}"
  >
    <AutoTypography :variant>
      &nbsp;
    </AutoTypography>
    <ShimmerBox :class="e('shimmer')" :border-radius :rounded :color/>
  </component>
</template>

<style lang="scss">
.text-shimmer-box {
  position: relative;

  &__shimmer {
    position: absolute;
    top: 12.5%;
    bottom: 12.5%;
    width: 100%;
  }
}
</style>
