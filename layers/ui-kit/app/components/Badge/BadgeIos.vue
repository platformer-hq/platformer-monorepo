<script setup lang="ts">
import TypographyIos from '../Typography/TypographyIos/TypographyIos.vue';

export interface BadgeIosProps {
  variant?: 'filled';
}

defineProps<BadgeIosProps>();
const { b } = bem('badge-ios');
</script>

<template>
  <TypographyIos :class="b(variant)" as="label" variant="caption2" weight="medium">
    <slot/>
  </TypographyIos>
</template>

<style lang="scss">
.badge-ios {
  display: inline-block;
  padding: 2px 4px 1px;
  border-radius: 6px;
  vertical-align: text-top;

  @each $palette in ('filled') {
    &--#{$palette} {
      background-color: var(--badge-ios-#{$palette}-bg-color);
      color: var(--badge-ios-#{$palette}-text-color);
    }
  }
}
</style>
