<script setup lang="ts">
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
</script>

<template>
  <TypographyAndroid
    class="list-android-item-body-right-badge"
    variant="subheadline2"
    weight="medium"
  >
    <slot/>
  </TypographyAndroid>
</template>

<style>
.list-android-item-body-right-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6.5px;
  border-radius: 1000px;
  min-width: 24px;
  background: var(--list-android-item-body-right-badge-bg);
  color: var(--list-android-item-body-right-badge-color);
  height: 24px;
}
</style>
