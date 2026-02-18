<script setup lang="ts">
import { bem } from 'vue-ui';

export type TextBaseAlign = 'left' | 'right' | 'center';

const [b] = bem('text-base');

export interface TextBaseProps {
  is?: string;
  align?: TextBaseAlign;
  caps?: boolean;
}

defineProps<TextBaseProps>();
</script>

<template>
  <component
    :is="is || 'span'"
    :class="b(align, caps && 'caps')"
  >
    <slot />
  </component>
</template>

<style lang="scss">
.text-base {
  margin: 0;

  @each $align in (left, center, right) {
    &--#{$align} {
      text-align: $align;
    }
  }

  &--caps {
    text-transform: uppercase;
  }
}
</style>
