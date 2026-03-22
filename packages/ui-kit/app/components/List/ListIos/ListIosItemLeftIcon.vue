<script setup lang="ts">
defineProps<{
  /**
   * True if the left small padding should be added.
   */
  padLeft?: boolean;
}>();

const { b } = bem('list-ios-item-left-icon');
</script>

<template>
  <div :class="b({'pad-left': padLeft})">
    <slot/>
  </div>
</template>

<style lang="scss">
.list-ios-item-left-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &--pad-left {
    padding-left: 6px;
  }
}
</style>
