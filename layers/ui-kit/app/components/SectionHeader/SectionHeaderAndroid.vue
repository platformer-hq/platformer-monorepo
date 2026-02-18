<script setup lang="ts">
export type SectionHeaderAndroidVariant = 'headline' | 'default';
export interface SectionHeaderAndroidProps {
  /**
   * @default 'default'
   */
  variant?: SectionHeaderAndroidVariant;
}

const { variant = 'default' } = defineProps<SectionHeaderAndroidProps>();
const { b } = bem('section-header-android');

defineSlots<{
  default(): unknown;
  right(): unknown;
}>();
</script>

<template>
  <div :class="b({variant}, variant)">
    <TypographyAndroid
      :variant="variant === 'headline' ? 'headline6' : 'button1'"
      weight="medium"
    >
      <slot/>
    </TypographyAndroid>
    <slot name="right"/>
  </div>
</template>

<style lang="scss">
.section-header-android {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  &--default {
    padding: 19px 20px 3px;
    color: var(--section-header-android-default-color);
  }

  &--headline {
    padding: 24px 20px 4px;
    color: var(--section-header-android-headline-color);
  }
}
</style>
