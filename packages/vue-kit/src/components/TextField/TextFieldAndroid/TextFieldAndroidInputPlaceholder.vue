<script lang="ts" setup>
import TypographyAndroid, { type TypographyAndroidVariant, type TypographyAndroidWeight } from '@/components/Typography/TypographyAndroid/TypographyAndroid.vue';

export interface TextFieldAndroidInputPlaceholderProps {
  fontVariant?: TypographyAndroidVariant;
  fontWeight?: TypographyAndroidWeight;
}

defineProps<TextFieldAndroidInputPlaceholderProps>();
</script>

<template>
  <TypographyAndroid
    class="tgui-text-field-android-input-placeholder"
    :variant="fontVariant"
    :weight="fontWeight"
  >
    <slot/>
  </TypographyAndroid>
</template>

<style>
.tgui-text-field-android-input-placeholder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  color: var(--tgui-text-field-android-input-placeholder-color, #8E8E93);
}
</style>
