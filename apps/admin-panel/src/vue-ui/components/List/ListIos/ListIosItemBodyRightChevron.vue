<script setup lang="ts">
import { ChevronRight28, type ChevronRight28Props } from 'vue-ui';
defineProps<ChevronRight28Props>();
</script>

<template>
  <ChevronRight28
    class="tgui-list-ios-item-body-right-chevron"
    v-bind="$props"
  />
</template>

<style lang="scss">
.tgui-list-ios-item-body-right-chevron {
  width: 20px;
  color: var(--tgui-list-ios-item-body-right-chevron-color, #C8C7CC);
  margin: 0 -6.5px;
}
</style>
