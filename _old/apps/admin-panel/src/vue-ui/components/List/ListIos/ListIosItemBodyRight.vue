<script setup lang="ts">
defineSlots<{
  counter(): any;
  chevron(): any;
  checkmark(): any;
  clear(): any;
  switch(): any;
  label(): any;
  radio(): any;
}>();
</script>

<template>
  <div class="tgui-list-ios-item-body-right">
    <slot name="counter" />
    <slot name="checkmark" />
    <slot name="switch" />
    <slot name="label" />
    <slot name="chevron" />
    <slot name="clear" />
    <slot name="radio" />
  </div>
</template>

<style lang="scss">
.tgui-list-ios-item-body-right {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}
</style>
