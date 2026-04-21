<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';

import { bem } from '@/utils/bem';

const { fit = 'contain', position = 'center', show = true } = defineProps<{
  /**
   * @default 'contain'
   */
  fit?: 'cover' | 'contain';
  /**
   * @default 'center'
   */
  position?: 'center' | string;
  /**
   * @default true
   */
  show?: boolean;
}>();
const emit = defineEmits<{ ready: [] }>();

const img = useTemplateRef('img');

// There could be some cases when the image is already loaded. For example, this
// is true for "data:" sources. In this case @load event will not be fired.
onMounted(() => {
  if (img.value?.complete) {
    emit('ready');
  }
});

const { b } = bem('tgui-progressive-image-element');
</script>

<template>
  <img
    ref="img"
    :class="b(fit, {show})"
    :style="{objectPosition: position}"
    @load="$emit('ready')"
  >
</template>

<style lang="scss">
.tgui-progressive-image-element {
  position: absolute;
  inset: 0;
  -webkit-touch-callout: none;
  user-select: none;
  pointer-events: none;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 300ms ease-out;

  &--show {
    opacity: 1;
  }

  &--contain {
    object-fit: contain;
  }

  &--cover {
    object-fit: cover;
  }
}
</style>
