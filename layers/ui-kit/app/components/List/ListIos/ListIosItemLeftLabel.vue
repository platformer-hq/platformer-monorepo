<script setup lang="ts">
</script>

<template>
  <TypographyIos variant="body" class="list-ios-item-left-label">
    <slot />
  </TypographyIos>
</template>

<style>
.list-ios-item-left-label {
  padding-right: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--list-ios-item-left-label-color);
}
</style>
