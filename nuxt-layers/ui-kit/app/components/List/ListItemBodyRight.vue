<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform';

const platform = usePlatform();

const { b } = bem('list-item-body-right');
</script>

<template>
  <div :class="b(platform)">
    <slot/>
  </div>
</template>

<style lang="scss">
.list-item-body-right {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;

  &--ios {
    gap: 6px;
  }
}
</style>
