<script setup lang="ts">
import type { CheckmarkIOS28Props } from '~~/packages/ui-kit/src/icons';

defineProps<CheckmarkIOS28Props>();
</script>

<template>
  <IconCheckmarkIOS28 v-bind="$props" class="list-android-item-body-right-checkmark"/>
</template>

<style lang="scss">
.list-android-item-body-right-checkmark {
  margin: 0 -6px;
  color: var(--list-android-item-body-right-checkmark-color);
}
</style>
