<script setup lang="ts">
</script>

<template>
  <TypographyIos variant="body" class="tgui-list-ios-item-left-label">
    <slot />
  </TypographyIos>
</template>

<style>
.tgui-list-ios-item-left-label {
  padding-right: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--tgui-list-ios-item-left-label-color);
}
</style>
