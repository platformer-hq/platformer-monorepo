<script setup lang="ts">
defineProps<{ show?: boolean }>();
</script>

<template>
  <Transition name="tgui-ios-activation-highlight">
    <span v-if="show" key="active" class="tgui-ios-activation-highlight"/>
  </Transition>
</template>

<style lang="scss">
.tgui-ios-activation-highlight {
  background: currentColor;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  opacity: 0.1;
  pointer-events: none;

  &-leave-active {
    transition: 300ms all;
  }

  &-leave-to {
    opacity: 0;
  }
}
</style>
