<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';

const platform = usePlatform();
</script>

<template>
  <VTypography
    class="list-item-body-right-badge"
    :variant="platform === 'android' ? 'subheadline2' : 'callout'"
    weight="medium"
  >
    <slot/>
  </VTypography>
</template>

<style>
.list-item-body-right-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6.5px;
  border-radius: 1000px;
  min-width: 24px;
  background: var(--destructive-text-color);
  color: white;
  height: 24px;
}
</style>
