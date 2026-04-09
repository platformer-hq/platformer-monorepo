<script setup lang="ts">
import { IconCheckmarkIOS28, type IconCheckmarkIOS28Props } from '@/icons';

defineProps<IconCheckmarkIOS28Props>();
</script>

<template>
  <IconCheckmarkIOS28 v-bind="$props" class="tgui-list-ios-item-body-right-checkmark"/>
</template>

<style>
.tgui-list-ios-item-body-right-checkmark {
  margin: 0 -6px;
  color: var(--tgui-list-ios-item-body-right-checkmark-color);
}
</style>
