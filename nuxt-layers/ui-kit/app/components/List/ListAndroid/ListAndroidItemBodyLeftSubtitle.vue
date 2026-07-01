<script setup lang="ts">
import type {
  TypographyAndroidProps,
} from '#ui-kit/components/Typography/TypographyAndroid/TypographyAndroid.vue';

defineProps<{
  maxLines?: TypographyAndroidProps['maxLines'];
}>();
const { b } = bem('tgui-list-android-item-body-left-subtitle');
</script>

<template>
  <TypographyAndroid variant="subheadline1" :max-lines :class="b()">
    <slot />
  </TypographyAndroid>
</template>

<style>
.tgui-list-android-item-body-left-subtitle {
  width: 100%;
  color: var(--tgui-list-android-item-body-left-subtitle-color);
}
</style>
