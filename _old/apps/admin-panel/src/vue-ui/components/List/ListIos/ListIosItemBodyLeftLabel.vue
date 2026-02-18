<script setup lang="ts">
import { bem } from 'vue-ui';

import TextIos from '@/vue-ui/components/Text/TextIos.vue';

defineProps<{
  /**
   * True if the medium font-weight should be applied.
   */
  medium?: boolean;
  /**
   * True if the component is allowed to have several lines.
   */
  multiline?: boolean;
}>();
const [b] = bem('tgui-list-ios-item-body-left-label');
</script>

<template>
  <TextIos
    is="p"
    variant="body"
    :class="b({ 'single-line': !multiline })"
    :weight="medium ? 'medium' : undefined"
  >
    <slot />
  </TextIos>
</template>

<style lang="scss">
.tgui-list-ios-item-body-left-label {
  width: 100%;

  &--single-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
