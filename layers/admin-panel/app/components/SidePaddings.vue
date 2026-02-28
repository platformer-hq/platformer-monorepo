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
  <component :is="as" class="side-paddings">
    <slot/>
  </component>
</template>

<style>
.side-paddings {
  padding-inline: 16px;
}
</style>
