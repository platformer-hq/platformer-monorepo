<script setup lang="ts">
defineProps<{ size: number }>();
</script>

<template>
  <span class="root" :style="{ height: `${size}px` }">
    <span
      v-for="i in 8"
      :key="i"
      class="particle"
      :style="{
        'animation-delay': `${125 * i}ms`,
        transform: `rotate(${45 * i}deg) translate3d(0, -125%, 0)`,
      }"
    />
  </span>
</template>

<style scoped lang="scss">
@use "sass:math";

.root {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--tgui-loading-indicator-ios-particle-color, #6D6D72);
  position: relative;
  aspect-ratio: 1 / 1;
}

.particle {
  position: absolute;
  background-color: currentColor;
  border-radius: 1000px;
  transform-origin: center;
  animation: ping 1s steps(8) infinite;
  opacity: 0.5;
  width: 11%;
  height: 30%;
}

@mixin frame($step, $opacity) {
  #{$step * 12.5}% {
    opacity: $opacity;
  }
}

@keyframes ping {
  @include frame(0, 1);
  @include frame(1, 0.82);
  @include frame(2, 0.65);
  @include frame(3, 0.6);
  @include frame(4, 0.5);
  @include frame(8, 0.5);
}
</style>