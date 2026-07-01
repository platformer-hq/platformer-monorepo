<script setup lang="ts">
// TODO: Replace with @workspace/icons
import { IconCheckmarkIOS28, type IconCheckmarkIOS28Props } from '@tma.js/vue-kit';

defineProps<IconCheckmarkIOS28Props>();
</script>

<template>
  <IconCheckmarkIOS28 v-bind="$props" class="tgui-list-android-item-body-right-checkmark"/>
</template>

<style>
.tgui-list-android-item-body-right-checkmark {
  margin: 0 -6px;
  color: var(--tgui-list-android-item-body-right-checkmark-color);
}
</style>
