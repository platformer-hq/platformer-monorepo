<script setup lang="ts">
</script>

<template>
  <VTypography variant="body" class="list-item-left-label">
    <slot />
  </VTypography>
</template>

<style>
.list-item-left-label {
  padding-right: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--text-color);
}
</style>
