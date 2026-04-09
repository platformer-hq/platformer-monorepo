<script setup lang="ts">
import {
  IconIosChevronSubheadline1Semibold20,
  type IconIosChevronSubheadline1Semibold20Props,
} from '@/icons';

defineProps<IconIosChevronSubheadline1Semibold20Props>();
</script>

<template>
  <IconIosChevronSubheadline1Semibold20
    class="tgui-list-ios-item-body-right-chevron"
    v-bind="$props"
  />
</template>

<style>
.tgui-list-ios-item-body-right-chevron {
  margin: 0 -5px;
  color: var(--tgui-list-ios-item-body-right-chevron-color);
}
</style>
