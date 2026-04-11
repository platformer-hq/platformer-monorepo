<script setup lang="ts">
import { bem, type KnownHtmlTag } from '@tma.js/vue-kit';

const { as = 'p' } = defineProps<{
  /**
   * @default 'p'
   */
  as?: KnownHtmlTag;
  variant?: 'heading' | 'body' | 'footnote';
  weight?: 'regular' | 'semibold';
}>();

const { b } = bem('v-typography');
const { $init: { platform } } = useNuxtApp();
</script>

<template>
  <component :is="as" :class="b(variant, weight, platform)">
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
    font-weight: 600;
  }

  &--regular {
    font-weight: 400;
  }

  &--semibold {
    font-weight: 600;
  }

  &--ios {
    font-family: -apple-system, 'SF Pro', BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  }

  &--android {
    font-family: Roboto, "Segoe UI", "Helvetica Neue", sans-serif;
  }
}
</style>
