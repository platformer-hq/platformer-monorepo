<script setup lang="ts">
import type { KnownHtmlTag } from '@/types/html-tags.js';
import { bem } from '@/utils/bem';

withDefaults(defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'div',
});

const { b } = bem('tgui-list-android-item-body-right');
</script>

<template>
  <component :is="as" :class="b()">
    <slot/>
  </component>
</template>

<style>
.tgui-list-android-item-body-right {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
