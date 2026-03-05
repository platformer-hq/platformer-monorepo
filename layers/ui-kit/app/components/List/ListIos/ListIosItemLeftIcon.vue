<script setup lang="ts">
defineProps<{
  /**
   * True if the icon is supposed to be square. This only adds a left padding.
   */
  square?: boolean;
}>();

defineSlots<{
  default(props: {
    square?: boolean;
  }): unknown;
}>();

const { b } = bem('list-ios-item-left-icon');
</script>

<template>
  <div :class="b({square})">
    <slot :square/>
  </div>
</template>

<style lang="scss">
.list-ios-item-left-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 6px;

  &--square {
    padding-left: 0;
  }
}
</style>
