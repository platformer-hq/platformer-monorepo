<script setup lang="ts">
import type { StyleValue } from 'vue';

import {
  useSafeAreaInsets,
  type UseSafeAreaInsetsOptions,
} from '@/composables/useSafeAreaInsets/useSafeAreaInsetsAttrs';

export interface UseSafeAreaInsetsProps extends UseSafeAreaInsetsOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = defineProps<UseSafeAreaInsetsProps>();
defineSlots<{
  default(props: { classes: unknown[]; style: StyleValue }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const insetAttrs = useSafeAreaInsets(() => props);
</script>

<template>
  <slot :classes="[insetAttrs.classes, $props.class]" :style="[insetAttrs.style, style]"/>
</template>
