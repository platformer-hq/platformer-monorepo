<script setup lang="ts">
import { bem } from 'vue-ui';

import TextIos from '@/vue-ui/components/Text/TextIos.vue';

defineProps<{
  /**
   * True if the component is allowed to have several lines.
   */
  multiline?: boolean;
}>();
const [b] = bem('tgui-list-ios-item-body-left-subtitle');
</script>

<template>
  <TextIos
    variant="subheadline2"
    :class="b({ 'single-line': !multiline })"
  >
    <slot />
  </TextIos>
</template>

<style lang="scss">
.tgui-list-ios-item-body-left-subtitle {
  color: var(--tgui-list-ios-item-body-left-subtitle-color, #8E8E93);
  width: 100%;

  &--single-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
