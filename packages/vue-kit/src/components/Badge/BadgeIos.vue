<script setup lang="ts">
import TypographyIos from '@/components/Typography/TypographyIos/TypographyIos.vue';
import { bem } from '@/utils/bem.js';

export interface BadgeIosProps {
  variant?: 'filled';
}

defineProps<BadgeIosProps>();
const { b } = bem('tgui-badge-ios');
</script>

<template>
  <TypographyIos :class="b(variant)" as="label" variant="caption2" weight="medium">
    <slot/>
  </TypographyIos>
</template>

<style lang="scss">
.tgui-badge-ios {
  padding: 2px 4px;
  border-radius: 6px;
  display: inline-block;
  vertical-align: middle;
  margin-top: -3px;

  @each $variant in ('filled') {
    &--#{$variant} {
      background-color: var(--tgui-badge-ios-#{$variant}-bg-color);
      color: var(--tgui-badge-ios-#{$variant}-text-color);
    }
  }
}
</style>
