<script setup lang="ts">
</script>

<template>
  <TypographyIos class="list-ios-item-body-right-badge" variant="callout">
    <slot/>
  </TypographyIos>
</template>

<style>
.list-ios-item-body-right-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6.5px;
  border-radius: 1000px;
  min-width: 24px;
  background: var(--list-ios-item-body-right-badge-bg);
  color: var(--list-ios-item-body-right-badge-color);
  height: 24px;
}
</style>
