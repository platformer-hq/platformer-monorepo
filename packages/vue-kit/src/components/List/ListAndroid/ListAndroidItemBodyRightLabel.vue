<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
</script>

<template>
  <TypographyAndroid class="list-android-item-body-right-label" variant="body">
    <slot/>
  </TypographyAndroid>
</template>

<style>
.list-android-item-body-right-label {
  color: var(--list-android-item-body-right-label-color);
}
</style>
