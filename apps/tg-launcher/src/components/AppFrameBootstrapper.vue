<script setup lang="ts">
import { computed, watchEffect } from 'vue';

import AppFrame, { type AppFrameEmits, type AppFrameProps } from '@/components/AppFrame.vue';

const props = defineProps<AppFrameProps>();
const emit = defineEmits<AppFrameEmits>();

const isHttp = computed(() => props.url.startsWith('http://'));

watchEffect(() => {
  // Web doesn't support loading iframes with an HTTP URL in the secure context. All we
  // can do is just to redirect to the URL.
  if (isHttp.value) {
    // TODO: Show error in Web versions of Telegram. Show redirect message on all
    // other platforms.
    window.location.href = props.url;
  }
});
</script>

<template>
  <AppFrame
    v-if="!isHttp"
    :load-timeout
    :url
    @error="emit('error', $event)"
    @ready="emit('ready')"
  />
</template>
