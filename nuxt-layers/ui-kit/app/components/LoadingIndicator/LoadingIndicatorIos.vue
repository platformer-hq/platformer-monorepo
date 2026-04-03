<script setup lang="ts">
defineProps<{
  size: number;
  color?: string;
}>();

const { b, e } = bem('loading-indicator-ios');
</script>

<template>
  <div :class="b()" :style="{ width: toPx(size), height: toPx(size), color }">
    <span
      v-for="i in 8"
      :key="i"
      :class="e('particle')"
      :style="{
        'animation-delay': `${125 * i}ms`,
        transform: `rotate(${45 * i}deg) translate3d(0, -125%, 0)`,
      }"
    />
    </div>
</template>

<style lang="scss">
@use "sass:math";

.loading-indicator-ios {
  display: flex;
  justify-content: center;
  align-items: center;
  color: currentColor;
  position: relative;
  aspect-ratio: 1 / 1;

  &__particle {
    position: absolute;
    background-color: currentColor;
    border-radius: 1000px;
    transform-origin: center;
    animation: loading-indicator-ios-ping 1s steps(8) infinite;
    opacity: 0.5;
    width: 11%;
    height: 30%;
  }
}

@mixin frame($step, $opacity) {
  #{$step * 12.5}% {
    opacity: $opacity;
  }
}

@keyframes loading-indicator-ios-ping {
  @include frame(0, 1);
  @include frame(1, 0.82);
  @include frame(2, 0.65);
  @include frame(3, 0.6);
  @include frame(4, 0.5);
  @include frame(8, 0.5);
}
</style>
