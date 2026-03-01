<script lang="ts" setup>
/**
 * This component is reponsible for displaying a block, notifying the user that the content
 * is loading.
 */
import type { AutoTypographyVariant } from '~/auto-components/AutoTypography/AutoTypography.vue';

defineProps<{
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
}>();
</script>

<template>
  <div class="text-shimmer-box" :style="{margin: toPx(margin)}">
    <AutoTypography :variant>
      &nbsp;
    </AutoTypography>
    <ShimmerBox :width :border-radius :rounded :color class="text-shimmer-box__shimmer"/>
  </div>
</template>

<style lang="scss">
.text-shimmer-box {
  position: relative;

  &__shimmer {
    position: absolute;
    top: 12.5%;
    bottom: 12.5%;
  }
}
</style>
