<script setup lang="ts">
import TypographyIos from '@/components/Typography/TypographyIos/TypographyIos.vue';
</script>

<template>
  <TypographyIos class="list-ios-item-body-right-label" variant="body">
    <slot/>
  </TypographyIos>
</template>

<style>
.list-ios-item-body-right-label {
  color: var(--list-ios-item-body-right-label-color);
}
</style>
