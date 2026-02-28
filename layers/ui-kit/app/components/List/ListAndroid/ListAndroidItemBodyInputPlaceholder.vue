<script setup lang="ts">
defineSlots<{
  default(): unknown;
}>();
</script>

<template>
  <TypographyAndroid
    v-if="$slots.default"
    class="list-android-item-body-input-placeholder"
    variant="body"
  >
    <slot/>
  </TypographyAndroid>
</template>

<style>
.list-android-item-body-input-placeholder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.8;
  color: var(--list-android-item-body-input-placeholder-color)
}
</style>
