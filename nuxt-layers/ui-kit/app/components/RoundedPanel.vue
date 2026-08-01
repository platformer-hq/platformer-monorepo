<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform';
import type { KnownHtmlTag } from '~/types';

const { as = 'div' } = defineProps<{
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}>();

const platform = usePlatform();

const { b } = bem('rounded-panel-ios');
</script>

<template>
  <component :is="as" :class="b(platform)">
    <slot/>
  </component>
</template>

<style lang="scss">
.rounded-panel-ios {
  &--ios {
    border-radius: 26px;
  }
  &--android {
    border-radius: 16px;
  }
}
</style>
