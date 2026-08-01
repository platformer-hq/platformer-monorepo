<script setup lang="ts">
import type { TypographyProps } from '~ui-kit/components/VTypography/VTypography.vue';

defineProps<{
  /**
   * True if the medium font-weight should be applied.
   */
  medium?: boolean;
  maxLines?: TypographyProps['maxLines'];
}>();
const { b } = bem('list-item-body-left-label');
</script>

<template>
  <VTypography
    variant="body"
    :max-lines
    :class="b()"
    :weight="medium ? 'medium' : undefined"
  >
    <slot />
  </VTypography>
</template>

<style>
.list-item-body-left-label {
  width: 100%;
}
</style>
