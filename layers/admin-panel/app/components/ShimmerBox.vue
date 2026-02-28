<script lang="ts" setup>
/**
 * This component is reponsible for displaying a block, notifying the user that the content
 * is loading.
 */
import type { KnownHtmlTag } from '#layers/ui-kit';

const { as = 'div', color = 'quaternary' } = defineProps<{
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
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  margin?: string | number;
}>();
const { b, e } = bem('shimmer-box');
const isDark = useIsDark();
</script>

<template>
  <ColorBox
    :as
    :class="b({rounded})"
    :bg="color === 'transparent' ? undefined : `${color}-fill-bg`"
    :style="{
      height: toPx(height),
      width: toPx(width),
      borderRadius: toPx(borderRadius),
      margin: toPx(margin),
    }"
  >
    <span :class="e('shine', isDark ? 'dark' : 'light')"/>
    <slot/>
  </ColorBox>
</template>

<style lang="scss">
.shimmer-box {
  position: relative;
  overflow: hidden;

  &--rounded {
    border-radius: 10000px;
  }

  &__shine {
    @keyframes ui-shimmer-shine {
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
      var(--shimmer-color),
      transparent
    );
    animation: ui-shimmer-shine 2.5s linear infinite;

    &--dark {
      --shimmer-color: rgba(255,255,255,.1);
    }

    &--light {
      --shimmer-color: rgba(255,255,255,.3);
    }
  }
}
</style>
