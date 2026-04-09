<script setup lang="ts">
import type { KnownHtmlTag } from '@/types';

const { as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>();
</script>

<template>
  <component :is="as" class="tgui-rounded-panel-android">
    <slot/>
  </component>
</template>

<style>
.tgui-rounded-panel-android {
  border-radius: var(--tgui-rounded-panel-android-border-radius, 16px);
}
</style>
