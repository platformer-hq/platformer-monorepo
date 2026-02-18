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
const rootRef = useTemplateRef<HTMLElement>('root');
defineExpose({ element: rootRef });
</script>

<template>
  <component :is="as" ref="root" class="view-content">
    <slot />
  </component>
</template>

<style lang="scss">
.view-content {
  max-width: 375px;
  margin: auto;
}
</style>
