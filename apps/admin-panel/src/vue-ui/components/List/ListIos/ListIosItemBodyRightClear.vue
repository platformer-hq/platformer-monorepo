<script setup lang="ts">
import { XmarkFill28, type XmarkFill28Props } from 'vue-ui';

defineProps<XmarkFill28Props>();
</script>

<template>
  <XmarkFill28
    v-bind="$props"
    :size="20"
    class="tgui-list-ios-item-body-right-clear"
  />
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-list-ios-item-body-right-clear {
  color: var(--tgui-list-ios-item-body-right-clear-color, #8E8E93);
  @include mixins.clickable;
  padding: 10px;
  box-sizing: content-box;
  margin-right: -10px;
}
</style>
