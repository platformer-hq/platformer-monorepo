<script setup lang="ts">
defineSlots<{
  icon(): any;
  label(): any;
  checkbox(): any;
}>();
</script>

<template>
  <div class="tgui-list-android-item-left">
    <slot name="icon" />
    <slot name="label" />
    <slot name="checkbox" />
  </div>
</template>
