<script setup lang="ts">
const { size = 'default' } = defineProps<{
  width?: number | string;
  /**
   * @default 'default'
   */
  size?: 'default' | 'small' | 'large';
}>();
const { b } = bem('list-android-item-left');
</script>

<template>
  <div :class="b(size)" :style="{width: toPx(width)}">
    <slot/>
  </div>
</template>

<style lang="scss">
.list-android-item-left {
  &--small {
    width: 32px;
  }

  &--default {
    width: 44px;
  }

  &--large {
    width: 51px;
  }
}
</style>
