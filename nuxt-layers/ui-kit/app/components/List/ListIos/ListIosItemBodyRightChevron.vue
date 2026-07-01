<script setup lang="ts">
// TODO: Replace with workspace icons.
import {
  IconIosChevronSubheadline1Semibold20,
  type IconIosChevronSubheadline1Semibold20Props,
} from '@tma.js/vue-kit';

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
