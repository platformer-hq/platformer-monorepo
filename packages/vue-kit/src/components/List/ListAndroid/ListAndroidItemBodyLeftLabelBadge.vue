<script setup lang="ts">
import BadgeAndroid, { type BadgeAndroidProps } from '@/components/Badge/BadgeAndroid.vue';

defineProps<BadgeAndroidProps>();
</script>

<template>
  <BadgeAndroid class="tgui-list-android-item-body-left-label-badge" v-bind="$props">
    <slot/>
  </BadgeAndroid>
</template>

<style>
.tgui-list-android-item-body-left-label-badge {
  margin-left: 6px;
}
</style>
