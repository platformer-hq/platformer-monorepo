<script setup lang="ts">
import type { SysIosChevronSubheadline1Semibold20Props } from '#ui-kit-icons';

defineProps<SysIosChevronSubheadline1Semibold20Props>();
</script>

<template>
  <IconSysIosChevronSubheadline1Semibold20
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
