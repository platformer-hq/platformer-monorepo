<script setup lang="ts">
const { b } = bem('rounded-panel');
const platform = useTmaPlatform();
</script>

<template>
  <div :class="b(platform.mapped)">
    <slot/>
  </div>
</template>

<style lang="scss">
.rounded-panel {
  &--ios {
    border-radius: 26px;
  }
  &--android {
    border-radius: 16px;
  }
}
</style>
