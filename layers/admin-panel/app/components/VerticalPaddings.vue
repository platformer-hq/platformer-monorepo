<script setup lang="ts">
import type { KnownHtmlTag } from '#layers/ui-kit';

const { as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>();
</script>

<template>
  <component :is="as" class="vertical-paddings">
    <slot/>
  </component>
</template>

<style>
.vertical-paddings {
  padding-block: 16px;
}
</style>
