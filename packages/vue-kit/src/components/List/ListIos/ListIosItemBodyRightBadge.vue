<script setup lang="ts">
import TypographyIos from '@/components/Typography/TypographyIos/TypographyIos.vue';
</script>

<template>
  <TypographyIos class="tgui-list-ios-item-body-right-badge" variant="callout">
    <slot/>
  </TypographyIos>
</template>

<style>
.tgui-list-ios-item-body-right-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6.5px;
  border-radius: 1000px;
  min-width: 24px;
  background: var(--tgui-list-ios-item-body-right-badge-bg);
  color: var(--tgui-list-ios-item-body-right-badge-color);
  height: 24px;
}
</style>
