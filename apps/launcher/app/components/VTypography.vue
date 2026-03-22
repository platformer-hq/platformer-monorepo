<script setup lang="ts">
import type { KnownHtmlTag } from '#packages/ui-kit';

const { as = 'p' } = defineProps<{
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
  variant: 'heading' | 'body' | 'footnote';
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
  margin: 0;

  &--footnote {
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
  }

  &--body {
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
  }

  &--heading {
    line-height: 26px;
    font-size: 22px;
    font-weight: 500;
  }

  [data-platform="ios"] & {
    font-family: -apple-system, 'SF Pro', BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  }

  [data-platform="android"] & {
    font-family: Roboto, "Segoe UI", "Helvetica Neue", sans-serif;
  }
}
</style>
