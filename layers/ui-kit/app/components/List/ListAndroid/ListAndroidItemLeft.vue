<script setup lang="ts">
const { width = 'default' } = defineProps<{
  /**
   * @default 'default'
   */
  width?: 'default' | 'large' | 'auto' | number | string;
}>();
const { b } = bem('list-android-item-left');
const isKnownWidth = computed(() => ['default', 'large'].includes(width as string));
</script>

<template>
  <div
    :class="b({[width]: isKnownWidth})"
    :style="{width: isKnownWidth ? undefined : toPx(width)}"
  >
    <slot/>
  </div>
</template>

<style lang="scss">
.list-android-item-left {
  &--default {
    width: 44px;
  }

  &--large {
    width: 51px;
  }
}
</style>
