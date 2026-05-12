<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags';
import { bem } from '@/utils/bem';

withDefaults(defineProps<{
  /**
   * @default 'label'
   */
  as?: KnownHtmlTag;
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'disabled';
}>(), {
  as: 'label',
  variant: 'regular',
});

const { b } = bem('tgui-list-ios-item-body-input');
</script>

<template>
  <component :is="as" :class="b(variant)">
    <slot/>
  </component>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.tgui-list-ios-item-body-input {
  @each $variant in ("regular", "disabled") {
    &--#{$variant} {
      --input-text-color: var(--tgui-list-ios-item-body-left-input-#{$variant}-text-color);
      --input-placeholder-color: var(--tgui-list-ios-item-body-left-input-#{$variant}-placeholder-color);
    }
  }
}
</style>
