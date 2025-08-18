<script setup lang="ts">
import TextIos from '@/vue-ui/components/Text/TextIos.vue';
</script>

<template>
  <TextIos
    is="p"
    variant="body"
    class="tgui-list-ios-item-left-label"
  >
    <slot />
  </TextIos>
</template>

<style>
.tgui-list-ios-item-left-label {
  padding-right: 16px;
  color: var(--tgui-list-ios-item-left-label-color, black);
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
