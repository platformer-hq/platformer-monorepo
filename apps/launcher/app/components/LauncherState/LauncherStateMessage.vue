<script setup lang="ts">
</script>

<template>
  <VTypography class="launcher-state-message" as="h2" variant="body">
    <slot/>
  </VTypography>
</template>

<style>
.launcher-state-message {
  color: var(--tg-theme-subtitle-text-color);
}
</style>
