<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';

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
  <component :is="as" class="tgui-list-android-item-body-input">
    <slot/>
  </component>
</template>
