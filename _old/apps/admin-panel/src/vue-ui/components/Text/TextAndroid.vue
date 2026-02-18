<script setup lang="ts">
import { bem } from 'vue-ui';

import TextBase, { type TextBaseProps } from './TextBase.vue';

export interface TextAndroidProps extends TextBaseProps {
  variant?:
    | 'headline5'
    | 'headline6'
    | 'headline7'
    | 'body1'
    | 'subtitle1'
    | 'subtitle2'
    | 'button1'
    | 'button2'
    | 'caption1'
    | 'caption2';
  weight?: 'regular' | 'medium';
}

const { variant, weight, ...rest } = defineProps<TextAndroidProps>();
const [b] = bem('text-android');
</script>

<template>
  <TextBase
    v-bind="rest"
    :class="b(variant, weight)"
  >
    <slot />
  </TextBase>
</template>

<style lang="scss">
@use "sass:map";

@mixin weight($name, $value) {
  &--#{$name} {
    font-weight: $value;
  }
}

@function variant($size, $lineHeight, $weight: null, $letterSpacing: null) {
  @return (
    size: $size,
    lineHeight: $lineHeight,
    letterSpacing: $letterSpacing,
    weight: $weight
  )
}

.text-android {
  font-family: Roboto, "Segoe UI", "Helvetica Neue", sans-serif;

  @each $variant, $settings in (
    headline5: variant(24px, 28px, 500),
    headline6: variant(20px, 24px, 500),
    headline7: variant(17px, 22px, 500),
    body1: variant(16px, 20px),
    subtitle1: variant(15px, 18px),
    subtitle2: variant(14px, 16px),
    button1: variant(15px, 18px, 500, 0.1px),
    button2: variant(14px, 16px, 600),
    caption1: variant(13px, 16px),
    caption2: variant(12px, 14px),
  ) {
    &--#{$variant} {
      line-height: map.get($settings, "lineHeight");
      font-size: map.get($settings, "size");

      $weight: map.get($settings, "weight");
      @if $weight {
        font-weight: $weight;
      }

      $letterSpacing: map.get($settings, "letterSpacing");
      @if $letterSpacing {
        letter-spacing: $letterSpacing;
      }

      @if $variant == 'button2' {
        text-transform: uppercase;
      }
    }
  }

  @each $weightName, $weightValue in (regular: 400, medium: 500) {
    @include weight($weightName, $weightValue);
  }

  &__mono {
    font-family: Roboto Mono, sans-serif;
  }
}
</style>
