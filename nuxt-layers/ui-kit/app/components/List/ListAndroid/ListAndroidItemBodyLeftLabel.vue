<script setup lang="ts">
import type { TypographyAndroidProps } from '#ui-kit/components/Typography/TypographyAndroid/TypographyAndroid.vue';

defineProps<{
  /**
   * True if the medium font-weight should be applied.
   */
  medium?: boolean;
  maxLines?: TypographyAndroidProps['maxLines'];
}>();
const { b } = bem('tgui-list-android-item-body-left-label');
</script>

<template>
  <TypographyAndroid
    variant="body"
    :max-lines
    :class="b()"
    :weight="medium ? 'medium' : undefined"
  >
    <slot />
  </TypographyAndroid>
</template>

<style>
.tgui-list-android-item-body-left-label {
  width: 100%;
}
</style>
