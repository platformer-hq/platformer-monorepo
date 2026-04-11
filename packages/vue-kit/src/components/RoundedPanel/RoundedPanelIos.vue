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
  <component :is="as" class="tgui-rounded-panel-ios">
    <slot/>
  </component>
</template>

<style>
.tgui-rounded-panel-ios {
  border-radius: var(--tgui-rounded-panel-ios-border-radius, 26px);
}
</style>
