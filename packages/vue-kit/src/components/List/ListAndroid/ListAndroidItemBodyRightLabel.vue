<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
</script>

<template>
  <TypographyAndroid class="tgui-list-android-item-body-right-label" variant="body">
    <slot/>
  </TypographyAndroid>
</template>

<style>
.tgui-list-android-item-body-right-label {
  color: var(--tgui-list-android-item-body-right-label-color);
}
</style>
