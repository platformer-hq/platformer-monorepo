<script lang="ts" setup>
defineSlots<{
  default(): unknown;
  placeholder(): unknown;
}>();
</script>

<template>
  <div class="tgui-text-field-ios-input">
    <slot/>
    <slot name="placeholder"/>
  </div>
</template>

<style>
.tgui-text-field-ios-input {
  height: 100%;
  position: relative;
}
</style>
