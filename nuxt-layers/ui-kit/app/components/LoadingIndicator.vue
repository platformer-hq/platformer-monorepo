<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';

defineProps<{
  /**
   * Element size in pixels.
   */
  size: number;
  color?: ColorReferenceAnyColor;
}>();

const platform = usePlatform();

const { b, e } = bem('loading-indicator');
</script>

<template>
  <span v-if="platform === 'android'" :class="b('android')">
    <svg :class="e('android-icon')" :width="size" :height="size">
      <circle
        cx="50%"
        cy="50%"
        r="50%"
        stroke-linecap="round"
        stroke="currentcolor"
      />
    </svg>
  </span>
  <div v-else :class="b('ios')" :style="{ width: toPx(size), height: toPx(size), color }">
    <span
      v-for="i in 8"
      :key="i"
      :class="e('ios-particle')"
      :style="{
        'animation-delay': `${125 * i}ms`,
        transform: `rotate(${45 * i}deg) translate3d(0, -125%, 0)`,
      }"
    />
  </div>
</template>

<style lang="scss">
@use "sass:map";
@use "sass:list";

.loading-indicator {
  &--android {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--ios {
    display: flex;
    justify-content: center;
    align-items: center;
    color: currentColor;
    position: relative;
    aspect-ratio: 1 / 1;
  }

  &__ios-particle {
    position: absolute;
    background-color: currentColor;
    border-radius: 1000px;
    transform-origin: center;
    animation: loading-indicator-ios-particle-animation 1s steps(8) infinite;
    opacity: 0.5;
    width: 11%;
    height: 30%;
  }

  &__android-icon {
    fill: transparent;
    overflow: visible;
    display: block;
    animation: 1.4s ease-in-out infinite loading-indicator-android-stroke,
    1.4s linear infinite loading-indicator-android-spin;
    stroke-width: 9%;
  }
}

@keyframes loading-indicator-android-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-indicator-android-stroke {
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

@mixin iosParticleFrame($step, $opacity) {
  #{$step * 12.5}% {
    opacity: $opacity;
  }
}

@keyframes loading-indicator-ios-particle-animation {
  @include iosParticleFrame(0, 1);
  @include iosParticleFrame(1, 0.82);
  @include iosParticleFrame(2, 0.65);
  @include iosParticleFrame(3, 0.6);
  @include iosParticleFrame(4, 0.5);
  @include iosParticleFrame(8, 0.5);
}
</style>
