<script setup lang="ts">
import type { KnownHtmlTag } from '#packages/ui-kit';

const { as = 'p' } = defineProps<{
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
  variant: 'title' | 'body';
}>();

const { b } = bem('v-typography');
</script>

<template>
  <component :is="as" :class="b(variant)">
    <slot/>
  </component>
</template>

<style lang="scss">
.v-typography {
  .platform-ios & {
    font-family: -apple-system, 'SF Pro', BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  }

  .platform-android & {
    font-family: Roboto, "Segoe UI", "Helvetica Neue", sans-serif;
  }
}
</style>
