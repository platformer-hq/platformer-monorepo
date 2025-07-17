<script setup lang="ts">
import { bem } from 'utils';

const [b] = bem('text');

const { as = 'p' } = defineProps<{
  as?: 'span' | 'p' | 'h1';
  variant?: 'heading' | 'footnote' | 'body';
}>();
</script>

<template>
  <component :is="as" :class="b(variant)">
    <slot name="default" />
  </component>
</template>

<style lang="scss">
.text {
  font-family: Roboto, "Segoe UI", "Helvetica Neue", Arial, sans-serif;

  &--footnote {
    font-size: 13px;
    line-height: 16px;
  }

  &--body {
    font-size: 16px;
    line-height: 20px;
  }

  &--heading {
    line-height: 28px;
    font-size: 24px;
    font-weight: 500;
  }
}
</style>