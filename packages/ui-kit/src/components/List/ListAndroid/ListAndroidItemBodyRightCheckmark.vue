<script setup lang="ts">
import IconCheckmarkIOS28, { type IconCheckmarkIOS28Props } from '@/icons/icons/28/IconCheckmarkIOS28.vue';

defineProps<IconCheckmarkIOS28Props>();
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
