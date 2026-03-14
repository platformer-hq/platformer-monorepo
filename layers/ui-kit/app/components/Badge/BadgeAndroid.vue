<script setup lang="ts">
import TypographyAndroid from '../Typography/TypographyAndroid/TypographyAndroid.vue';

export interface BadgeAndroidProps {
  variant?: 'filled';
}

defineProps<BadgeAndroidProps>();
const { b } = bem('badge-android');
</script>

<template>
  <TypographyAndroid :class="b(variant)" as="label" variant="caption2" weight="medium">
    <slot/>
  </TypographyAndroid>
</template>

<style lang="scss">
.badge-android {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 5px;
  vertical-align: text-top;

  @each $palette in ('filled') {
    &--#{$palette} {
      background-color: var(--badge-android-#{$palette}-bg-color);
      color: var(--badge-android-#{$palette}-text-color);
    }
  }
}
</style>
