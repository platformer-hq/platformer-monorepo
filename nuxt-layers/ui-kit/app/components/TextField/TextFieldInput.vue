<script lang="ts" setup>
defineSlots<{
  default(): unknown;
  placeholder(): unknown;
}>();
</script>

<template>
  <div class="text-field-input">
    <slot/>
    <slot name="placeholder"/>
  </div>
</template>

<style>
.text-field-input {
  height: 100%;
  position: relative;
}
</style>
