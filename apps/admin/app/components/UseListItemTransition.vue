<script setup lang="ts">
import { createListAndroidItemTransition, createListIosItemTransition } from '@tma.js/vue-kit';
import type { TransitionProps } from 'vue';

defineSlots<{
  default(props: Pick<TransitionProps, 'onEnter' | 'onLeave'>): unknown;
}>();

const platform = useTmaPlatform();
</script>

<template>
  <slot
    v-bind="platform.isMappedIos
      ? createListIosItemTransition()
      : createListAndroidItemTransition()"
  />
</template>
