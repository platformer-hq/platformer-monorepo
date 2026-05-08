<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';

import XMarkFillIcon from './xmark-fill-28.svg?component';

withDefaults(defineProps<{
  /**
   * @default 'i'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'i',
});
</script>

<template>
  <component :is="as" class="tgui-list-ios-item-body-right-clear">
    <XMarkFillIcon :width="20" :height="20"/>
  </component>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.tgui-list-ios-item-body-right-clear {
  display: flex;
  padding: 4px;
  margin-right: -4px;
  color: var(--tgui-list-ios-item-body-right-clear-color);
  @include mixins.clickable;
}
</style>
