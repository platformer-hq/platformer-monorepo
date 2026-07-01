<script setup lang="ts">
import type { BadgeAndroidProps } from '#ui-kit/components/Badge/BadgeAndroid.vue';

defineProps<BadgeAndroidProps>();
</script>

<template>
  <BadgeAndroid class="tgui-list-android-item-body-left-label-badge" v-bind="$props">
    <slot/>
  </BadgeAndroid>
</template>

<style>
.tgui-list-android-item-body-left-label-badge {
  margin-left: 3px;
}
</style>
