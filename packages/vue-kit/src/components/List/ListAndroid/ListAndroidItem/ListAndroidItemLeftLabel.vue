<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
</script>

<template>
  <TypographyAndroid variant="body" class="tgui-list-android-item-left-label">
    <slot />
  </TypographyAndroid>
</template>

<style>
.tgui-list-android-item-left-label {
  padding-right: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--tgui-list-android-item-left-label-color);
}
</style>
