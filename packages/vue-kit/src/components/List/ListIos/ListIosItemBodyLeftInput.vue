<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags';

withDefaults(defineProps<{
  /**
   * @default 'label'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'label',
});
</script>

<template>
  <component :is="as" class="tgui-list-ios-item-body-left-input">
    <slot/>
  </component>
</template>
