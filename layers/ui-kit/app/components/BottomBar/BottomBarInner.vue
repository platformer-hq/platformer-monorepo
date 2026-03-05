<script setup lang="ts">
const { b } = bem('bottom-bar-inner');
</script>

<template>
  <div :class="b()">
    <slot/>
  </div>
</template>

<style lang="scss">
.bottom-bar-inner {
  padding: 8px 16px 16px;
}
</style>
