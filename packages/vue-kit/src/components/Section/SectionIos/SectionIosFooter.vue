<script setup lang="ts">
import TypographyIos from '@/components/Typography/TypographyIos/TypographyIos.vue';
</script>

<template>
  <TypographyIos class="tgui-section-ios-footer" variant="footnote">
    <slot/>
  </TypographyIos>
</template>

<style>
.tgui-section-ios-footer {
  padding: 8px 16px;
  color: var(--tgui-section-ios-footer-color);
}
</style>
