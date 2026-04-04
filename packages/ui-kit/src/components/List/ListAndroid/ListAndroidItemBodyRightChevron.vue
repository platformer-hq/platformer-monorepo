<script setup lang="ts">
import ChevronRight28, { type ChevronRight28Props } from '@/icons/icons/28/ChevronRight28.vue';

defineProps<ChevronRight28Props>();
</script>

<template>
  <ChevronRight28 class="list-android-item-body-right-chevron" v-bind="$props"/>
</template>

<style lang="scss">
.list-android-item-body-right-chevron {
  width: 20px;
  margin-right: -6.5px;
  color: var(--list-android-item-body-right-chevron-color);
}
</style>
