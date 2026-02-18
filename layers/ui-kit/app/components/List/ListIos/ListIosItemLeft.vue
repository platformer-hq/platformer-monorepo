<script setup lang="ts">
const { width = 'default' } = defineProps<{
  /**
   * @default 'default'
   */
  width?: 'default' | 'auto' | number | string;
}>();
const { b } = bem('list-ios-item-left');
</script>

<template>
  <div
    :class="b({[width]: width === 'default'})"
    :style="{width: width !== 'default' && width !== 'auto' ? toPx(width) : undefined}"
  >
    <slot/>
  </div>
</template>

<style lang="scss">
.list-ios-item-left {
  &--default {
    width: 50px;
  }
}
</style>
