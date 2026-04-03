<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { useTemplateRef, computed } from 'vue';

const rootRef = useTemplateRef('root');
const rootEl = computed(() => rootRef.value?.element);
const { height } = useElementSize(rootEl);

defineExpose({
  element: rootEl,
  height,
});
</script>

<template>
  <SafeAreaInsets ref="root" class="bottom-bar" left right bottom>
    <slot/>
  </SafeAreaInsets>
</template>

<style lang="scss">
.bottom-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  transition: 300ms ease-out;
}

.ios-page-transition--leave {
  &.ios-page-transition--left {
    .bottom-bar {
      left: -100px;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
  &.ios-page-transition--right {
    .bottom-bar {
      left: 100%;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
}

.android-page-transition--leave {
  &.android-page-transition--left {
    .bottom-bar {
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
  &.android-page-transition--right {
    .bottom-bar {
      left: 100%;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
}
</style>
