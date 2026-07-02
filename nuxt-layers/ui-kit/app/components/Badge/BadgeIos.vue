<script setup lang="ts">
export interface BadgeIosProps {
  palette?: (
    'filled' | 'gray' | 'overlay' | 'outlined' | 'tinted-blue' | 'tinted-green' | 'tinted-red'
  );
  /**
   * @default 'xs'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  glass?: boolean;
}

withDefaults(defineProps<BadgeIosProps>(), { size: 'xs' });
const { b } = bem('tgui-badge-ios');
</script>

<template>
  <TypographyIos
    :class="b(palette, size, {glass})"
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
  </TypographyIos>
</template>

<style lang="scss">
.tgui-badge-ios {
  border-radius: 6px;
  display: inline-block;
  vertical-align: middle;

  &--glass {
    box-shadow: var(--tgui-elevated-box-shadow);
  }

  @each $variant in (
    'filled', 'gray', 'overlay', 'outlined', 'tinted-blue', 'tinted-green', 'tinted-red'
  ) {
    &--#{$variant} {
      background-color: var(--tgui-badge-ios-#{$variant}-bg-color);
      color: var(--tgui-badge-ios-#{$variant}-text-color);
      border: 1px solid var(--tgui-badge-ios-#{$variant}-border-color);
    }
  }

  @each $size, $padding in (
    'xs': 2px 4px 1px,
    'sm': 4px 4px 3px,
    'md': 2px 4px,
    'lg': 3px 4px 3px,
    'xl': 3px 4px,
  ) {
    &--#{$size} {
      padding: $padding;
    }
  }

  &--rounded {
    border-radius: 1000px;
  }
}
</style>
