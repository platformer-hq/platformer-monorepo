<script setup lang="ts">
import type { StyleValue } from 'vue';

export type UseTypographyBaseAlign = 'left' | 'right' | 'center';
export interface UseTypographyBaseSlotProps {
  classes?: unknown[];
  style?: StyleValue;
}
export interface UseTypographyBaseProps {
  class?: unknown;
  style?: StyleValue;
  align?: UseTypographyBaseAlign;
  caps?: boolean;
  /**
   * Maximum lines allowed to display.
   * @default 'infinite'
   */
  maxLines?: number | 'infinite';
}

const { maxLines = 'infinite' } = defineProps<UseTypographyBaseProps>();
defineSlots<{
  default(props: UseTypographyBaseSlotProps): unknown;
}>();
defineOptions({ inheritAttrs: false });

const { b } = bem('typography-base');
</script>

<template>
  <slot
    :classes="[$props.class, b(align, {
      caps,
      'single-line': maxLines === 1,
      clamped: typeof maxLines === 'number' && maxLines > 1,
    })]"
    :style="[style, {
      '--max-lines': typeof maxLines === 'number' && maxLines > 1 ? maxLines : undefined,
    }]"
  />
</template>

<style lang="scss">
@use "@ui-kit-mixins" as mixins;

.typography-base {
  margin: 0;

  @each $align in (left, center, right) {
    &--#{$align} {
      text-align: $align;
    }
  }

  &--caps {
    text-transform: uppercase;
  }

  &--single-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &--clamped {
    text-overflow: ellipsis;
    @include mixins.lineClamp(var(--max-lines));
  }
}
</style>
