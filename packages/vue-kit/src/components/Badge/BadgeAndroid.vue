<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
import { bem } from '@/utils/bem.js';

export interface BadgeAndroidProps {
  variant?: 'filled';
}

defineProps<BadgeAndroidProps>();
const { b } = bem('tgui-badge-android');
</script>

<template>
  <TypographyAndroid :class="b(variant)" as="label" variant="caption2" weight="medium">
    <slot/>
  </TypographyAndroid>
</template>

<style lang="scss">
.tgui-badge-android {
  padding: 2px 4px;
  border-radius: 5px;
  display: inline-block;
  vertical-align: middle;
  margin-top: -3px;

  @each $variant in ('filled') {
    &--#{$variant} {
      background-color: var(--tgui-badge-android-#{$variant}-bg-color);
      color: var(--tgui-badge-android-#{$variant}-text-color);
    }
  }
}
</style>
