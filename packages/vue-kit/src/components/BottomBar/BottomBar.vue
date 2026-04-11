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
</style>
