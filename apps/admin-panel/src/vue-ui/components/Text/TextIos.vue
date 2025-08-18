<script setup lang="ts">
import { bem } from 'vue-ui';

import TextBase, { type TextBaseProps } from './TextBase.vue';

export interface TextIosProps extends TextBaseProps {
  variant?:
    | 'title1'
    | 'title2'
    | 'title3'
    | 'headline'
    | 'body'
    | 'callout'
    | 'subheadline1'
    | 'subheadline2'
    | 'footnote'
    | 'caption1'
    | 'caption2'
    | 'regular'
    | 'medium'
    | 'semibold'
    | 'bold';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const [b] = bem('text-ios');
const { variant, weight, ...rest } = defineProps<TextIosProps>();
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
@mixin weight($name, $value) {
  &--#{$name} {
    font-weight: $value;
  }
}

@mixin variant($name, $size, $lineHeight, $weight: null) {
  &--#{$name} {
    line-height: $lineHeight;
    font-size: $size;
    font-weight: $weight;
  }
}

.text-ios {
  font-family: -apple-system, 'SF Pro', BlinkMacSystemFont, 'Helvetica Neue', sans-serif;

  @include variant("title1", 28px, 34px, 700);
  @include variant("title2", 22px, 28px);
  @include variant("title3", 20px, 24px);
  @include variant("headline", 17px, 22px, 590);
  @include variant("body", 17px, 22px);
  @include variant("callout", 16px, 22px);
  @include variant("subheadline1", 15px, 20px);
  @include variant("subheadline2", 14px, 18px);
  @include variant("footnote", 13px, 18px);
  @include variant("caption1", 12px, 16px);
  @include variant("caption2", 11px, 13px);
  @include weight("regular", 400);
  @include weight("medium", 510);
  @include weight("semibold", 590);
  @include weight("bold", 700);

  &--mono {
    font-family: ui-monospace, 'SF Mono', SFMono-Regular, 'DejaVu Sans Mono', Menlo, Consolas, monospace;

    &-numbers {
      font-variant-numeric: lining-nums tabular-nums;
    }
  }
}
</style>
