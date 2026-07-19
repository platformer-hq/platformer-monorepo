<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core';

import { useTelegramEventsHandler } from './_composables/useTelegramEventsHandler';

const props = defineProps<{
  /**
   * Amount of time given to the application to load.
   */
  initTimeout: number;
  /**
   * A URL to use to load the application.
   */
  src: string;
}>();
const emit = defineEmits<{
  error: [];
  timeout: [];
  ready: [];
}>();

const { $init: { initialColors } } = useNuxtApp();

const iframe = useTemplateRef('iframe');
const iframeOrigin = computed(() => new URL(props.src).origin);

// Give some time for the mini application to load.
// When the timeout is reached, notify the parent component about it.
const { stop: removeTimeout } = useTimeoutFn(() => emit('timeout'), () => props.initTimeout);

useTelegramEventsHandler({
  iframe,
  iframeOrigin,
  initialColors: () => initialColors,
  onReady() {
    removeTimeout();
    emit('ready');
  },
});
</script>

<template>
  <iframe
    ref="iframe"
    class="app-frame"
    :src
    @error="
      removeTimeout();
      emit('error');
    "
  />
</template>

<style>
.app-frame {
  display: block;
  border: none;
  height: 100%;
  width: 100%;
}
</style>
