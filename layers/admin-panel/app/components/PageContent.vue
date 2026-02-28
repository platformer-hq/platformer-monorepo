<script lang="ts" setup>
/**
 * This component is responsible for providing a container with a restricted width, equal to
 * the max possible view content width.
 */
import type { KnownHtmlTag } from '#layers/ui-kit';

const { as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>();
</script>

<template>
  <component :is="as" class="page-content">
    <slot />
  </component>
</template>

<style lang="scss">
.page-content {
  max-width: 450px;
  margin: auto;
}
</style>
