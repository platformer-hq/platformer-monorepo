<script lang="ts" setup>
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
  <component :is="as" class="tgui-list-android">
    <slot />
  </component>
</template>

<style>
.tgui-list-android {
  appearance: none;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
