<script setup lang="ts">
defineSlots<{
  default(): unknown;
}>();
</script>

<template>
  <TypographyIos
    v-if="$slots.default"
    class="list-ios-item-body-input-placeholder"
    variant="body"
  >
    <slot/>
  </TypographyIos>
</template>

<style>
.list-ios-item-body-input-placeholder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.8;
  color: var(--list-ios-item-body-input-placeholder-color);
}
</style>
