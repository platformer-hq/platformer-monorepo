<script setup lang="ts">
import TextIos from '@/vue-ui/components/Text/TextIos.vue';
</script>

<template>
  <TextIos
    is="p"
    class="tgui-list-ios-item-body-right-counter"
    variant="callout"
  >
    <slot />
  </TextIos>
</template>

<style>
.tgui-list-ios-item-body-right-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1000px;
  color: var(--tgui-list-ios-item-body-right-counter-text-color, white);
  background: var(--tgui-list-ios-item-body-right-counter-bg, #FF3B30);
  min-width: 24px;
  height: 24px;
  box-sizing: border-box;
  padding: 0 7px;
}
</style>
