<script setup lang="ts">
import type { KnownHtmlTag } from '@/types';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'div',
});
</script>

<template>
  <component :is="as" class="tgui-list-android-item-left-icon">
    <slot/>
  </component>
</template>

<style>
.tgui-list-android-item-left-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
