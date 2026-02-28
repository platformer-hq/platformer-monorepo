<script setup lang="ts">
import type { KnownHtmlTag } from '#layers/ui-kit';

/**
 * Component that renders a block with default horizontal paddings based on the current platform.
 * We usually use somewhere at the lowest level of a view.
 */
const { as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>();

const platform = useTmaPlatform();
const { b } = bem('auto-side-paddings');
</script>

<template>
  <component :is="as" :class="b(platform.mapped)">
    <slot/>
  </component>
</template>

<style>
.auto-side-paddings--ios {
  padding: 0 16px;
}
</style>
