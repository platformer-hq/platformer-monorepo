<script lang="ts" setup>
import type { KnownHtmlTag } from '~ui-kit/types';

export interface ShimmerBoxProps {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
  rounded?: boolean;
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  margin?: string | number;
  display?: string;
  /**
   * Color to apply to the shimmer background.
   * @default 'quaternary'
   */
  color?: 'tertiary' | 'quaternary' | 'transparent';
}

const { as = 'div', color = 'quaternary' } = defineProps<ShimmerBoxProps>();
const isDark = useIsDark();
const { b, e } = bem('shimmer-box');
</script>

<template>
  <component
    :is="as"
    :class="b({rounded})"
    :style="{
      background: color === 'transparent'
        ? undefined
        : cssColorTokenReference(`${color}-fill-background`),
      height: toPx(height),
      width: toPx(width),
      borderRadius: toPx(borderRadius),
      margin: toPx(margin),
      display,
      '--shine-color': isDark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.3)',
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
      var(--shine-color),
      transparent
    );
    animation: shimmer-box-shine 2s linear infinite;
  }
}
</style>
