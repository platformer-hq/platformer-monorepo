<script setup lang="ts">
import { bem } from '@/utils/bem';

defineProps<{
  /**
   * Element size in pixels.
   */
  size: number;
  color?: string;
}>();
const { b, e } = bem('tgui-loading-indicator-android');
</script>

<template>
  <span :class="b()">
    <svg :class="e('icon')" :width="size" :height="size">
      <circle
        cx="50%"
        cy="50%"
        r="50%"
        stroke-linecap="round"
        stroke="currentcolor"
      />
    </svg>
  </span>
</template>

<style lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

.tgui-loading-indicator-android {
  display: flex;
  align-items: center;
  justify-content: center;

  &__icon {
    fill: transparent;
    overflow: visible;
    display: block;
    animation: 1.4s ease-in-out infinite tgui-loading-indicator-android-stroke,
    1.4s linear infinite tgui-loading-indicator-android-spin;
    stroke-width: 9%;
  }
}

@keyframes tgui-loading-indicator-android-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes tgui-loading-indicator-android-stroke {
  $settings: (
    "0%": (#{1, 500%}, 0),
    "50%": (#{250%, 500%}, -37.5%),
    "100%": (#{250%, 500%}, -312.5%),
  );

  @each $percentage in ("0%", "50%", "100%") {
    $stroke-settings: map.get($settings, $percentage);

    #{$percentage} {
      stroke: {
        dasharray: list.nth($stroke-settings, 1);
        dashoffset: list.nth($stroke-settings, 2);
      }
    }
  }
}
</style>
