<script setup lang="ts">
import { ChevronRight28, type ChevronRight28Props } from 'vue-ui';

defineProps<ChevronRight28Props>();
</script>

<template>
  <ChevronRight28
    class="tgui-list-android-item-body-right-chevron"
    v-bind="$props"
  />
</template>

<style lang="scss">
.tgui-list-android-item-body-right-chevron {
  width: 20px;
  color: var(--tgui-list-android-item-body-right-chevron-color, #82868A);
  margin-right: -6.5px;
}
</style>
