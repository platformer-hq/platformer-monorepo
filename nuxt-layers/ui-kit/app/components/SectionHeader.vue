<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';

export type SectionHeaderVariant = 'headline' | 'default';
export interface SectionHeaderProps {
  /**
   * @default 'default'
   */
  variant?: SectionHeaderVariant;
}

const { variant = 'default' } = defineProps<SectionHeaderProps>();
defineSlots<{
  default(): unknown;
  right(): unknown;
}>();

const platform = usePlatform();

const { b } = bem('section-header');
</script>

<template>
  <div
    :class="b({variant, 'with-right': !!$slots.right}, variant, `${platform}-${variant}`)"
  >
    <VTypography
      :variant="variant === 'headline'
        ? (platform === 'ios' ? 'title3' : 'title2')
        : (platform === 'ios' ? 'body' : 'subheadline1')"
      weight="semibold"
    >
      <slot/>
    </VTypography>
    <slot name="right"/>
  </div>
</template>

<style lang="scss">
.section-header {
  &--with-right {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  &--default {
    color: var(--section-header-text-color);
  }

  &--headline {
    color: var(--text-color);
  }

  &--ios {
    &-default {
      padding: 10px 16px;
    }
    &-headline {
      padding: 8px 16px 12px;
    }
  }

  &--android {
    &-default {
      padding: 16px 20px 6px;
    }
    &-headline {
      padding: 20px 20px 8px;
    }
  }
}
</style>
