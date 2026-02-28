<script setup lang="ts">
export type SectionHeaderIosVariant = 'headline' | 'default';
export interface SectionHeaderIosProps {
  /**
   * @default 'default'
   */
  variant?: SectionHeaderIosVariant;
}

const { variant = 'default' } = defineProps<SectionHeaderIosProps>();
const { b } = bem('section-ios-header');

defineSlots<{
  default(): unknown;
  right(): unknown;
}>();
</script>

<template>
  <div :class="b({variant}, variant)">
    <TypographyIos :variant="variant === 'headline' ? 'title3' : 'body'" weight="semibold">
      <slot/>
    </TypographyIos>
    <slot name="right"/>
  </div>
</template>

<style lang="scss">
.section-ios-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  &--default {
    padding: 10px 16px;
    color: var(--section-ios-header-default-color);
  }

  &--headline {
    padding: 8px 16px 12px;
    color: var(--section-ios-header-headline-color);
  }
}
</style>
