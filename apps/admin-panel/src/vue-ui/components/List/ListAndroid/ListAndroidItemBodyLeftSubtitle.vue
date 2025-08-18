<script setup lang="ts">
import { bem } from 'vue-ui';

import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';

defineProps<{
  /**
   * True if the component is allowed to have several lines.
   */
  multiline?: boolean;
}>();
const [b] = bem('tgui-list-android-item-body-left-subtitle');
</script>

<template>
  <TextAndroid
    variant="subtitle1"
    class="tgui-list-android-item-body-left-subtitle"
    :class="b({ 'single-line': !multiline })"
  >
    <slot />
  </TextAndroid>
</template>

<style lang="scss">
.tgui-list-android-item-body-left-subtitle {
  color: var(--tgui-list-android-item-body-left-subtitle-color, #82868A);
  width: 100%;

  &--single-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
