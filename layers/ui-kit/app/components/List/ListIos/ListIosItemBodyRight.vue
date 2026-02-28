<script setup lang="ts">
const { b } = bem('list-ios-item-body-right');
</script>

<template>
  <div :class="b()">
    <slot />
  </div>
</template>

<style lang="scss">
.list-ios-item-body-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 6px;
  padding-left: 16px;
}
</style>
