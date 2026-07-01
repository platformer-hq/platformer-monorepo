<script lang="ts" setup>
defineProps<{
  color?: string;
  borderRadius?: string | number;
}>();
</script>

<template>
  <div
    class="tgui-progressive-image-placeholder"
    :style="{borderRadius: toPx(borderRadius), backgroundColor: color}"
  />
</template>

<style>
.tgui-progressive-image-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
