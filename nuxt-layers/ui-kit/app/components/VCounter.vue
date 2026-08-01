<script setup lang="ts">
import type { KnownCssColorToken } from '~colors/generated';

withDefaults(defineProps<{
  /**
   * @default 'button-color'
   */
  color?: KnownCssColorToken;
}>(), {
  color: 'button-color',
});
</script>

<template>
  <VTypography
    class="v-counter"
    variant="subheadline2"
    :style="{'--v-counter-bg-color': cssColorTokenReference(color)}"
    weight="semibold"
  >
    <slot/>
  </VTypography>
</template>

<style>
.v-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 1000px;
  min-width: 24px;
  color: white;
  height: 24px;
  background: var(--v-counter-bg-color);
}
</style>
