<script setup lang="ts">
import type { TypographyAndroidProps } from '../../Typography/TypographyAndroid/TypographyAndroid.vue';

defineProps<{
  /**
   * True if the medium font-weight should be applied.
   */
  medium?: boolean;
  maxLines?: TypographyAndroidProps['maxLines'];
}>();
const { b } = bem('list-android-item-body-left-label');
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

<style lang="scss">
@use "@ui-kit-mixins" as mixins;

.list-android-item-body-left-label {
  width: 100%;
}
</style>
