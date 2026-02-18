<script setup lang="ts">
import type {
  UseTypographyBaseAlign,
  UseTypographyBaseProps,
  UseTypographyBaseSlotProps,
} from '../TypographyBase/UseTypographyBase.vue';

/**
 * List of known font variants. This list is specific to each project.
 */
export type UseTypographyAndroidVariant =
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
export type UseTypographyAndroidSlotProps = UseTypographyBaseSlotProps;
export type UseTypographyAndroidAlign = UseTypographyBaseAlign;
export interface UseTypographyAndroidProps extends UseTypographyBaseProps {
  variant?: UseTypographyAndroidVariant;
  weight?: 'regular' | 'medium';
  mono?: boolean;
}

defineProps<UseTypographyAndroidProps>();
defineSlots<{
  default(props: UseTypographyAndroidSlotProps): unknown;
}>();
defineOptions({ inheritAttrs: false });

const { b } = bem('typography-android');
</script>

<template>
  <UseTypographyBase
    v-slot="{classes, style}"
    v-bind="$props"
    :class="[b(variant, weight, { mono }), $props.class]"
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

@mixin variant($name, $size, $lineHeight, $weight: null, $letterSpacing: null) {
  &--#{$name} {
    line-height: $lineHeight;
    font-size: $size;
    font-weight: $weight;
    letter-spacing: $letterSpacing;
  }
}

.typography-android {
  font-family: Roboto, "Segoe UI", "Helvetica Neue", sans-serif;

  @include variant("headline5", 24px, 28px, 500);
  @include variant("headline6", 20px, 24px, 500);
  @include variant("headline7", 17px, 22px, 500);
  @include variant("body1", 16px, 20px);
  @include variant("subtitle1", 15px, 18px);
  @include variant("subtitle2", 14px, 16px);
  @include variant("button1", 15px, 18px, 500, 0.1px);
  @include variant("button2", 14px, 16px, 600);
  @include variant("caption1", 13px, 16px);
  @include variant("caption2", 12px, 14px);

  @include weight("regular", 400);
  @include weight("medium", 500);

  &--mono {
    font-family: Roboto Mono, sans-serif;
  }
}
</style>
