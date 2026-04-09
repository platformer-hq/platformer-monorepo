<script setup lang="ts">
import { IconXmarkFill28 } from '@/icons';
</script>

<template>
  <i class="list-ios-item-body-right-clear">
    <IconXmarkFill28 :size="20"/>
  </i>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.list-ios-item-body-right-clear {
  display: flex;
  padding: 4px;
  margin-right: -4px;
  color: var(--list-ios-item-body-right-clear-color);
  @include mixins.clickable;
}
</style>
