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
  <component :is="as" class="rounded-panel-ios">
    <slot/>
  </component>
</template>

<style>
.rounded-panel-ios {
  border-radius: 26px;
}
</style>
