<script setup lang="ts">
import CheckmarkIOS28, { type CheckmarkIOS28Props } from '@/icons/icons/28/CheckmarkIOS28.vue';

defineProps<CheckmarkIOS28Props>();
</script>

<template>
  <CheckmarkIOS28 v-bind="$props" class="list-android-item-body-right-checkmark"/>
</template>

<style lang="scss">
.list-android-item-body-right-checkmark {
  margin: 0 -6px;
  color: var(--list-android-item-body-right-checkmark-color);
}
</style>
