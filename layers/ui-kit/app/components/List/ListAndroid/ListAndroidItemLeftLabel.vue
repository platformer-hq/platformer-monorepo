<script setup lang="ts">
</script>

<template>
  <TypographyAndroid variant="body" class="list-android-item-left-label">
    <slot />
  </TypographyAndroid>
</template>

<style>
.list-android-item-left-label {
  padding-right: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--list-android-item-left-label-color);
}
</style>
