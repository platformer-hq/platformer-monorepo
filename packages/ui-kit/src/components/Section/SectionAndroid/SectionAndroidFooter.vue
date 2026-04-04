<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
</script>

<template>
  <TypographyAndroid class="section-android-footer" variant="subheadline2">
    <slot/>
  </TypographyAndroid>
</template>

<style lang="scss">
.section-android-footer {
  padding: 12px 20px;
  color: var(--section-android-footer-color);
}
</style>
