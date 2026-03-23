<script setup lang="ts">
</script>

<template>
  <VTypography class="status-page-message" as="h2" variant="body">
    <slot/>
  </VTypography>
</template>

<style lang="scss">
.status-page-message {
  color: var(--subtitle-text-color);
}
</style>
