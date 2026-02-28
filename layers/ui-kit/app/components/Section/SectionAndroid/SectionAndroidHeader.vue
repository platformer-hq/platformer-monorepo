<script setup lang="ts">
export type SectionHeaderAndroidVariant = 'headline' | 'default';
export interface SectionHeaderAndroidProps {
  /**
   * @default 'default'
   */
  variant?: SectionHeaderAndroidVariant;
}

const { variant = 'default' } = defineProps<SectionHeaderAndroidProps>();
const { b } = bem('section-android-header');

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
.section-android-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  min-height: 40px;

  &--default {
    padding: 3px 20px;
    color: var(--section-header-android-default-color);
  }

  &--headline {
    padding: 24px 20px 4px;
    color: var(--section-header-android-headline-color);
  }
}
</style>
