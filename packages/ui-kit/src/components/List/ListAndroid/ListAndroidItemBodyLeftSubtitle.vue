<script setup lang="ts">
import type { TypographyAndroidProps } from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
import TypographyAndroid from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';
import { bem } from '@/utils/bem';

defineProps<{
  maxLines?: TypographyAndroidProps['maxLines'];
}>();
const { b } = bem('list-android-item-body-left-subtitle');
</script>

<template>
  <TypographyAndroid variant="subheadline1" :max-lines :class="b()">
    <slot />
  </TypographyAndroid>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.list-android-item-body-left-subtitle {
  width: 100%;
  color: var(--list-android-item-body-left-subtitle-color);
}
</style>
