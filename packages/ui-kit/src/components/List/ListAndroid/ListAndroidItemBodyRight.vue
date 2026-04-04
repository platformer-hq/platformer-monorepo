<script setup lang="ts">
import { bem } from '@/utils/bem';

const { b } = bem('list-android-item-body-right');
</script>

<template>
  <div :class="b()">
    <slot/>
  </div>
</template>

<style lang="scss">
.list-android-item-body-right {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
