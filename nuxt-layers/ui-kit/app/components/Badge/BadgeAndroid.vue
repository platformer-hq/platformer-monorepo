<script setup lang="ts">
export interface BadgeAndroidProps {
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

withDefaults(defineProps<BadgeAndroidProps>(), { size: 'xs' });
const { b } = bem('tgui-badge-android');
</script>

<template>
  <TypographyAndroid
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
  >
    <slot/>
  </TypographyAndroid>
</template>

<style lang="scss">
.tgui-badge-android {
  border-radius: 5px;
  display: inline-block;
  vertical-align: middle;

  &--glass {
    box-shadow: var(--tgui-elevated-box-shadow);
  }

  @each $variant in (
    'filled', 'gray', 'overlay', 'outlined', 'tinted-blue', 'tinted-green', 'tinted-red'
  ) {
    &--#{$variant} {
      background-color: var(--tgui-badge-android-#{$variant}-bg-color);
      color: var(--tgui-badge-android-#{$variant}-text-color);
      border: 1px solid var(--tgui-badge-android-#{$variant}-border-color);
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
