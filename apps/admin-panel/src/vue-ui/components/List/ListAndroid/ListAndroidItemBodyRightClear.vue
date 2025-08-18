<script setup lang="ts">
import { Xmark24, type Xmark24Props } from 'vue-ui';

defineProps<Xmark24Props>();
</script>

<template>
  <Xmark24
    v-bind="$props"
    :size="20"
    class="tgui-list-android-item-body-right-clear"
  />
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-list-android-item-body-right-clear {
  color: var(--tgui-list-android-item-body-right-clear-color, #8E8E93);
  padding: 10px;
  box-sizing: content-box;
  margin-right: -10px;
  @include mixins.clickable;
}
</style>
