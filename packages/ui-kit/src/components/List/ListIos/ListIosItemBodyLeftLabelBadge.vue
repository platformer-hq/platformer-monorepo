<script setup lang="ts">
import BadgeIos, { type BadgeIosProps } from '@/components/Badge/BadgeIos.vue';

defineProps<BadgeIosProps>();
</script>

<template>
  <BadgeIos class="list-ios-item-body-left-label-badge" v-bind="$props">
    <slot/>
  </BadgeIos>
</template>

<style>
.list-ios-item-body-left-label-badge {
  margin-left: 6px;
}
</style>
