<script setup lang="ts">
import TextIos from '@/vue-ui/components/Text/TextIos.vue';
</script>

<template>
  <TextIos
    is="p"
    variant="body"
    class="tgui-list-ios-item-body-right-label"
  >
    <slot />
  </TextIos>
</template>

<style lang="scss">
.tgui-list-ios-item-body-right-label {
  color: var(--tgui-list-ios-item-body-right-label-color, #8E8E93);
}
</style>
