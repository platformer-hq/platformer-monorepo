<script setup lang="ts">
import { IconIosChevronSubheadline1Semibold20, type IconIosChevronSubheadline1Semibold20Props } from '@/icons';

defineProps<IconIosChevronSubheadline1Semibold20Props>();
</script>

<template>
  <IconIosChevronSubheadline1Semibold20
    class="list-ios-item-body-right-chevron"
    v-bind="$props"
  />
</template>

<style lang="scss">
.list-ios-item-body-right-chevron {
  margin: 0 -5px;
  color: var(--list-ios-item-body-right-chevron-color);
}
</style>
