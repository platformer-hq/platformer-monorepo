<script setup lang="ts">
import IconXMarkFill28 from '@/icons/xmark-fill-28.svg?component';
import type { KnownHtmlTag } from '@/types/html-tags.js';

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
    <IconXMarkFill28 :width="20" :height="20"/>
  </component>
</template>

<style>
.tgui-list-ios-item-body-right-clear {
  display: flex;
  padding: 4px;
  margin-right: -4px;
  color: var(--tgui-list-ios-item-body-right-clear-color);
}
</style>
