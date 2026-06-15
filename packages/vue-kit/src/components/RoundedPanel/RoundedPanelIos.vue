<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';

const { as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>();
const elementRef = useTemplateRef<HTMLElement>('element');
defineExpose({ element: elementRef });
</script>

<template>
  <component :is="as" ref="element" class="tgui-rounded-panel-ios">
    <slot/>
  </component>
</template>

<style>
.tgui-rounded-panel-ios {
  border-radius: var(--tgui-rounded-panel-ios-border-radius, 26px);
}
</style>
