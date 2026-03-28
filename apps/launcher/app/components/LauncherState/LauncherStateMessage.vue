<script setup lang="ts">
</script>

<template>
  <VTypography class="launcher-state-message" as="h2" variant="body">
    <slot/>
  </VTypography>
</template>

<style lang="scss">
.launcher-state-message {
  color: var(--subtitle-text-color);
}
</style>
