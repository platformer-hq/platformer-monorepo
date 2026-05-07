<script setup lang="ts">
import XMarkFillIcon from './xmark-fill-28.svg?component';
</script>

<template>
  <i class="tgui-list-ios-item-body-right-clear">
    <XMarkFillIcon :width="20" :height="20"/>
  </i>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.tgui-list-ios-item-body-right-clear {
  display: flex;
  padding: 4px;
  margin-right: -4px;
  color: var(--tgui-list-ios-item-body-right-clear-color);
  @include mixins.clickable;
}
</style>
