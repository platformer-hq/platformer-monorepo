<script setup lang="ts">
import type {
  UseTypographyBaseAlign,
  UseTypographyBaseProps,
  UseTypographyBaseSlotProps,
} from '../TypographyBase/UseTypographyBase.vue';

/**
 * List of known font variants. This list is specific to each project.
 */
export type UseTypographyIosVariant =
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
  | 'caption2';
export type UseTypographyIosSlotProps = UseTypographyBaseSlotProps;
export type UseTypographyIosAlign = UseTypographyBaseAlign;
export interface UseTypographyIosProps extends UseTypographyBaseProps {
  variant?: UseTypographyIosVariant;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  rounded?: boolean;
}

defineProps<UseTypographyIosProps>();
defineSlots<{
  default(props: UseTypographyIosSlotProps): unknown;
}>();
defineOptions({ inheritAttrs: false });

const { b } = bem('typography-ios');
</script>

<template>
  <UseTypographyBase
    v-slot="{classes, style}"
    v-bind="$props"
    :class="[b(variant, weight, { rounded }), $props.class]"
  >
    <slot v-bind="{classes, style}"/>
  </UseTypographyBase>
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

.typography-ios {
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

  &--rounded {
    font-family: ui-rounded, 'SF Pro Rounded';
  }

  &--mono {
    font-family: ui-monospace, 'SF Mono', SFMono-Regular, 'DejaVu Sans Mono', Menlo,
    Consolas, monospace;

    &-numbers {
      font-variant-numeric: lining-nums tabular-nums;
    }
  }
}
</style>
