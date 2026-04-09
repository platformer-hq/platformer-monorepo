<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
import { bem } from '@/utils/bem';

export type SectionHeaderAndroidVariant = 'headline' | 'default';
export interface SectionHeaderAndroidProps {
  /**
   * @default 'default'
   */
  variant?: SectionHeaderAndroidVariant;
}

const { variant = 'default' } = defineProps<SectionHeaderAndroidProps>();
const { b } = bem('tgui-section-android-header');

defineSlots<{
  default(): unknown;
  right(): unknown;
}>();
</script>

<template>
  <div :class="b({variant}, variant)">
    <TypographyAndroid
      :variant="variant === 'headline' ? 'title2' : 'subheadline1'"
      weight="medium"
    >
      <slot/>
    </TypographyAndroid>
    <slot name="right"/>
  </div>
</template>

<style lang="scss">
.tgui-section-android-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  &--default {
    padding: 16px 20px 6px;
    color: var(--tgui-section-android-header-default-color);
  }

  &--headline {
    padding: 20px 20px 8px;
    color: var(--tgui-section-android-header-headline-color);
  }
}
</style>
