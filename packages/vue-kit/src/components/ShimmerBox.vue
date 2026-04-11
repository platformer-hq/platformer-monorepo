<script lang="ts" setup>
import type { KnownHtmlTag } from '@/types';
import { bem } from '@/utils/bem';
import { toPx } from '@/utils/toPx';

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
const { b, e } = bem('tgui-shimmer-box');
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
      '--tgui-shimmer-box-shine-color': shimmerColor,
    }"
  >
    <span :class="e('shine')"/>
    <slot/>
  </component>
</template>

<style lang="scss">
.tgui-shimmer-box {
  position: relative;
  overflow: hidden;

  &--rounded {
    border-radius: 10000px;
  }

  &__shine {
    @keyframes tgui-shimmer-box-shine {
      0% {
        transform: translateX(-100%);
      }
      50%, 100% {
        transform: translateX(100%);
      }
    }
    inset: 0;
    position: absolute;
    min-width: 150px;
    z-index: 0;
    background-image: linear-gradient(
      95deg,
      transparent,
      var(--tgui-shimmer-box-shine-color),
      transparent
    );
    animation: tgui-shimmer-box-shine 2s linear infinite;
  }
}
</style>
