<script setup lang="ts">
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
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 16px;
}
</style>
