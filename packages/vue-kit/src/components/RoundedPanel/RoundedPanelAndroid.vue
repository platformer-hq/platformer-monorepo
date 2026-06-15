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
  <component :is="as" ref="element" class="tgui-rounded-panel-android">
    <slot/>
  </component>
</template>

<style>
.tgui-rounded-panel-android {
  border-radius: var(--tgui-rounded-panel-android-border-radius, 16px);
}
</style>
