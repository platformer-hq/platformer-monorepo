<script setup lang="ts">
import { CheckmarkIOS28, type CheckmarkIOS28Props } from 'vue-ui';

defineProps<CheckmarkIOS28Props>();
</script>

<template>
  <CheckmarkIOS28
    v-bind="$props"
    class="tgui-list-ios-item-body-right-checkmark"
  />
</template>

<style lang="scss">
.tgui-list-ios-item-body-right-checkmark {
  color: var(--tgui-list-ios-item-body-right-checkmark-color, #007AFF);
  margin: 0 -6px;
}
</style>
