<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform';

const platform = usePlatform();

const { b } = bem('section-footer');
</script>

<template>
  <VTypography :class="b(platform)" :variant="platform === 'ios' ? 'footnote' : 'subheadline2'">
    <slot/>
  </VTypography>
</template>

<style lang="scss">
.section-footer {
  color: var(--subtitle-text-color);

  &--ios {
    padding: 8px 16px;
  }

  &--android {
    padding: 12px 20px;
  }
}
</style>
