<script setup lang="ts">
import { useTemplateRef, computed } from 'vue';

import SafeAreaInsets from '@/components/SafeAreaInsets/SafeAreaInsets.vue';

const rootRef = useTemplateRef('root');
const rootEl = computed(() => rootRef.value?.element);

defineExpose({ element: rootEl });
</script>

<template>
  <SafeAreaInsets ref="root" class="tgui-bottom-bar" left right bottom>
    <slot/>
  </SafeAreaInsets>
</template>

<style lang="scss">
.tgui-bottom-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  transition: 300ms ease-out;
}

.ios-page-transition--leave {
  &.ios-page-transition--left {
    .tgui-bottom-bar {
      left: -100px;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
  &.ios-page-transition--right {
    .tgui-bottom-bar {
      left: 100%;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
}

.android-page-transition--leave {
  &.android-page-transition--left {
    .tgui-bottom-bar {
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
  &.android-page-transition--right {
    .tgui-bottom-bar {
      left: 100%;
      transform: translateY(100%) scale(0.8);
      opacity: 0;
    }
  }
}
</style>
