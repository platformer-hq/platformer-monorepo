<script lang="ts" setup>
defineProps<{
  bgColor?: string;
}>();
</script>

<template>
  <ul class="list-android" :style="{backgroundColor: bgColor}">
    <slot />
  </ul>
</template>

<style lang="scss">
.list-android {
  appearance: none;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
