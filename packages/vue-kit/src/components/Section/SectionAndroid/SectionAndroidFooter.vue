<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
</script>

<template>
  <TypographyAndroid class="tgui-section-android-footer" variant="subheadline2">
    <slot/>
  </TypographyAndroid>
</template>

<style>
.tgui-section-android-footer {
  padding: 12px 20px;
  color: var(--tgui-section-android-footer-color);
}
</style>
