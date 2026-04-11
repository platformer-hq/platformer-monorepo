<script lang="ts" setup>
import { computed } from 'vue';

import { useImageCacheStore } from '@/stores/useImageCacheStore';
import { toPx } from '@/utils/toPx';

const props = defineProps<{
  height?: number | string;
  width?: number | string;
  src: string;
  srcset?: string;
}>();
defineSlots<{
  default(props: {
    src: string;
    srcset?: string;
    state: { state: 'error' | 'loading' | 'loaded' | 'unknown' };
    isError: boolean;
    isLoading: boolean;
    isLoaded: boolean;
    onError(): void;
    onLoad(): void;
  }): unknown;
}>();

const store = useImageCacheStore();

const formattedSource = computed(() => store.normalizeSource(props));
const state = store.track(formattedSource);
// You can use these to check how the app will look in specific states.
// const state = computed(() => ({ state: 'loading' } as const));
// const state = computed(() => ({ state: 'error' } as const));
</script>

<template>
  <div class="tgui-progressive-image" :style="{width: toPx(width), height: toPx(height)}">
    <slot
      v-bind="formattedSource"
      :state="state"
      :is-error="state.state === 'error'"
      :is-loading="state.state === 'loading' || state.state === 'unknown'"
      :is-loaded="state.state === 'loaded'"
      @error="store.mark(formattedSource, 'error')"
      @load="store.mark(formattedSource, 'loaded')"
    />
  </div>
</template>

<style>
.tgui-progressive-image {
  position: relative;
}
</style>
