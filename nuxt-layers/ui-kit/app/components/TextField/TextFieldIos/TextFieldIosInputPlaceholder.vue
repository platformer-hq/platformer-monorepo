<script lang="ts" setup>
import type {
  TypographyIosVariant,
  TypographyIosWeight,
} from '#ui-kit/components/Typography/TypographyIos/TypographyIos.vue';

export interface TextFieldIosInputPlaceholderProps {
  fontVariant?: TypographyIosVariant;
  fontWeight?: TypographyIosWeight;
}

defineProps<TextFieldIosInputPlaceholderProps>();
</script>

<template>
  <TypographyIos
    class="tgui-text-field-ios-input-placeholder"
    :variant="fontVariant"
    :weight="fontWeight"
  >
    <slot/>
  </TypographyIos>
</template>

<style>
.tgui-text-field-ios-input-placeholder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  color: var(--tgui-text-field-ios-input-placeholder-color, #8E8E93);
}
</style>
