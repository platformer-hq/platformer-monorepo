<script lang="ts" setup>
import { bem } from '@/utils/bem';

const { fit = 'contain', position = 'center', show = true } = defineProps<{
  /**
   * @default 'contain'
   */
  fit?: 'cover' | 'contain';
  /**
   * @default 'center'
   */
  position?: 'center' | string;
  /**
   * @default true
   */
  show?: boolean;
}>();

const { b } = bem('tgui-progressive-image-element');
</script>

<template>
  <img :class="b(fit, {show})" :style="{objectPosition: position}">
</template>

<style lang="scss">
.tgui-progressive-image-element {
  position: absolute;
  inset: 0;
  -webkit-touch-callout: none;
  user-select: none;
  pointer-events: none;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 300ms ease-out;

  &--show {
    opacity: 1;
  }

  &--contain {
    object-fit: contain;
  }

  &--cover {
    object-fit: cover;
  }
}
</style>
