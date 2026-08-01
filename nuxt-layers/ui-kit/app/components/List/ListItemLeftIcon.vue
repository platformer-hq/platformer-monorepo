<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform';

defineProps<{
  /**
   * True if the left small padding should be added.
   */
  padLeft?: boolean;
}>();

const platform = usePlatform();

const { b } = bem('list-item-left-icon');
</script>

<template>
  <div :class="b({'ios-pad-left': platform === 'ios' && padLeft})">
    <slot/>
  </div>
</template>

<style lang="scss">
.list-item-left-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &--ios {
    &-pad-left {
      padding-left: 6px;
    }
  }
}
</style>
