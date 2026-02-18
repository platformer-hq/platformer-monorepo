<script setup lang="ts">
import { bem } from 'vue-ui';

import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';

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
const [b] = bem('tgui-list-android-item-body-left-label');
</script>

<template>
  <TextAndroid
    is="p"
    variant="body1"
    :class="b({ 'single-line': !multiline })"
    :weight="medium ? 'medium' : undefined"
  >
    <slot />
  </TextAndroid>
</template>

<style lang="scss">
.tgui-list-android-item-body-left-label {
  width: 100%;

  &--single-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
