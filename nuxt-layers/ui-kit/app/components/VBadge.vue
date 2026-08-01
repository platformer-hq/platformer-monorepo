<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';

export interface BadgeProps {
  palette?: (
    | 'filled' | 'gray' | 'overlay' | 'outlined' | 'tinted-blue' | 'tinted-green' | 'tinted-red'
  );
  /**
   * @default 'xs'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  glass?: boolean;
}

withDefaults(defineProps<BadgeProps>(), { size: 'xs' });

const platform = usePlatform();

const { b } = bem('v-badge');
</script>

<template>
  <VTypography
    :class="b(palette, `${platform}-${size}`, platform, {glass})"
    as="label"
    :variant="({
      xs: 'caption2',
      sm: 'caption2',
      md: 'footnote',
      lg: 'subheadline2',
      xl: 'subheadline1',
    } as const)[size]"
    weight="medium"
    rounded
  >
    <slot/>
  </VTypography>
</template>

<style lang="scss">
@use "sass:list";

.v-badge {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  &--android {
    border-radius: 5px;

    @each $size, $padding in (
      'xs': 2px 4px 1px,
      'sm': 4px 4px 3px,
      'md': 2px 4px,
      'lg': 3px 4px 3px,
      'xl': 3px 4px,
    ) {
      &-#{$size} {
        padding: $padding;
      }
    }
  }

  &--ios {
    border-radius: 6px;

    @each $size, $padding in (
      'xs': 2px 4px 1px,
      'sm': 4px 4px 3px,
      'md': 2px 4px,
      'lg': 3px 4px 3px,
      'xl': 3px 4px,
    ) {
      &-#{$size} {
        padding: $padding;
      }
    }
  }

  &--glass {
    box-shadow: var(--glass-box-shadow);
  }

  @each $name, $settings in (
    "filled": (var(--button-text-color), var(--accent-text-color), transparent),
    "tinted-red": (white, var(--pink), transparent),
  ) {
    &--#{$name} {
      color: list.nth($settings, 1);
      background-color: list.nth($settings, 2);
      border: 1px solid list.nth($settings, 3);
    }
  }

  &--rounded {
    border-radius: 1000px;
  }
}
</style>
