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
  <component :is="as" class="rounded-panel-android">
    <slot/>
  </component>
</template>

<style>
.rounded-panel-android {
  border-radius: 16px;
}
</style>
