<script setup lang="ts">
import type { KnownHtmlTag } from '#packages/ui-kit';

const { as = 'p' } = defineProps<{
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
  variant?: 'heading' | 'body' | 'footnote';
  weight?: 'regular' | 'medium';
}>();

const { b } = bem('v-typography');
</script>

<template>
  <component :is="as" :class="b(variant, weight)">
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

  &--regular {
    font-weight: 400;
  }

  &--medium {
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
