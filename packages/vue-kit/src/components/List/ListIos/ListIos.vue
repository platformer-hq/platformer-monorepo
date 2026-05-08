<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';

withDefaults(defineProps<{
  /**
   * @default 'ul'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'ul',
});
</script>

<template>
  <component :is="as" class="tgui-list-ios">
    <slot />
  </component>
</template>

<style>
.tgui-list-ios {
  appearance: none;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
