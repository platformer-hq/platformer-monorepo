<script lang="ts" setup>
import type { KnownHtmlTag } from '~~/packages/ui-kit/app/types';

export interface ShimmerBoxProps {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  bgColor?: string;
  shimmerColor?: string;
  rounded?: boolean;
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  margin?: string | number;
  display?: string;
}

const { as = 'div', bgColor } = defineProps<ShimmerBoxProps>();
const { b, e } = bem('shimmer-box');
</script>

<template>
  <component
    :is="as"
    :class="b({rounded})"
    :style="{
      background: bgColor,
      height: toPx(height),
      width: toPx(width),
      borderRadius: toPx(borderRadius),
      margin: toPx(margin),
      display,
      '--shimmer-box-color': shimmerColor,
    }"
  >
    <span :class="e('shine')"/>
    <slot/>
  </component>
</template>

<style lang="scss">
.shimmer-box {
  position: relative;
  overflow: hidden;

  &--rounded {
    border-radius: 10000px;
  }

  &__shine {
    @keyframes shimmer-box-shine {
      0% {
        left: -200px;
      }
      40%, 100% {
        left: 100%;
      }
    }
    position: absolute;
    width: 200px;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    background-image: linear-gradient(
      90deg,
      transparent,
      var(--shimmer-box-color),
      transparent
    );
    animation: shimmer-box-shine 2.5s linear infinite;
  }
}
</style>
