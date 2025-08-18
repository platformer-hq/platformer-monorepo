<script setup lang="ts">
import { bem } from 'vue-ui';

const [b] = bem('text');

const { as = 'p' } = defineProps<{
  as?: 'span' | 'p' | 'h1';
  variant?: 'heading' | 'footnote' | 'body';
  weight?: 'semibold';
}>();
</script>

<template>
  <component
    :is="as"
    :class="b(variant, weight)"
  >
    <slot name="default" />
  </component>
</template>

<style lang="scss">
.text {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Ubuntu,
    'Helvetica Neue',
    sans-serif;

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

  &--semibold {
    font-weight: 500;
  }
}
</style>
