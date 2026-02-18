<script setup lang="ts">
const { b } = bem('list-ios');

const { rounded = true } = defineProps<{
  /**
   * @default true
   */
  rounded?: boolean;
  bgColor?: string;
}>();
</script>

<template>
  <ul :class="b({rounded})" :style="{backgroundColor: bgColor}">
    <slot />
  </ul>
</template>

<style lang="scss">
.list-ios {
  appearance: none;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;

  &--rounded {
    border-radius: 26px;
  }
}
</style>
