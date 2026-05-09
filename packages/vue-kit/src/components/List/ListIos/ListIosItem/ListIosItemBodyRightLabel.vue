<script setup lang="ts">
import TypographyIos from '@/components/Typography/TypographyIos/TypographyIos.vue';
</script>

<template>
  <TypographyIos class="tgui-list-ios-item-body-right-label" variant="body">
    <slot/>
  </TypographyIos>
</template>

<style>
.tgui-list-ios-item-body-right-label {
  color: var(--tgui-list-ios-item-body-right-label-color);
}
</style>
