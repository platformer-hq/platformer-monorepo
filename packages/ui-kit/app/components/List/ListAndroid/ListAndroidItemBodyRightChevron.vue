<script setup lang="ts">
import type { ChevronRight28Props } from '@ui-kit/icons';

defineProps<ChevronRight28Props>();
</script>

<template>
  <IconChevronRight28 class="list-android-item-body-right-chevron" v-bind="$props"/>
</template>

<style lang="scss">
.list-android-item-body-right-chevron {
  width: 20px;
  margin-right: -6.5px;
  color: var(--list-android-item-body-right-chevron-color);
}
</style>
