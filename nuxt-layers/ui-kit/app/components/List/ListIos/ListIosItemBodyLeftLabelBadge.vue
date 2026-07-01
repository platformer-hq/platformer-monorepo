<script setup lang="ts">
import type { BadgeIosProps } from '#ui-kit/components/Badge/BadgeIos.vue';

defineProps<BadgeIosProps>();
</script>

<template>
  <BadgeIos class="tgui-list-ios-item-body-left-label-badge" v-bind="$props">
    <slot/>
  </BadgeIos>
</template>

<style>
.tgui-list-ios-item-body-left-label-badge {
  margin-left: 6px;
}
</style>
