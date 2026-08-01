<script setup lang="ts">
import { useElementSize } from '@vueuse/core';

const size = useElementSize(useTemplateRef('root'));
</script>

<template>
  <span ref="root" class="button-shine" :style="{'--width': size.width.value + 'px'}"/>
</template>

<style lang="scss">
.button-shine {
  @keyframes button-shine-animation {
    from {
      background-position-x: calc(-1 * var(--width));
      border-color: transparent;
    }
    25% {
      border-color: rgba(255,255,255,.5);
    }
    50%, to {
      background-position-x: var(--width);
      border-color: transparent;
    }
  }
  pointer-events: none;
  position: absolute;
  inset: 0;
  width: 100%;
  border-radius: inherit;
  border: 1px solid;
  background: linear-gradient(105deg, transparent, rgba(255,255,255,.2), transparent) no-repeat;
  animation: button-shine-animation 3s ease-in-out infinite;
}
</style>
