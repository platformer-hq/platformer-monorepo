<script lang="ts" setup>
defineSlots<{
  default(): unknown;
  placeholder(): unknown;
}>();
</script>

<template>
  <div class="tgui-text-field-android-input">
    <slot/>
    <slot name="placeholder"/>
  </div>
</template>

<style>
.tgui-text-field-android-input {
  height: 100%;
  position: relative;
}
</style>
