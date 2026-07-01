<script setup lang="ts">
import type { KnownHtmlTag } from '#ui-kit/types';

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
  <component :is="as" class="tgui-list-ios-item-body-right">
    <slot />
  </component>
</template>

<style>
.tgui-list-ios-item-body-right {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 6px;
}
</style>
