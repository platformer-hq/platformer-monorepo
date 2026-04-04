<script setup lang="ts">
import TypographyIos from '@/components/Typography/TypographyIos/TypographyIos.vue';
</script>

<template>
  <TypographyIos class="section-ios-footer" variant="footnote">
    <slot/>
  </TypographyIos>
</template>

<style lang="scss">
.section-ios-footer {
  padding: 8px 16px;
  color: var(--section-ios-footer-color);
}
</style>
