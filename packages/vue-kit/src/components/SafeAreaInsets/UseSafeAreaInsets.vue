<script setup lang="ts">
import type { StyleValue } from 'vue';

import {
  useSafeAreaInsetsAttrs,
  type UseSafeAreaInsetsAttrsOptions,
} from '@/composables/useSafeAreaInsetsAttrs/useSafeAreaInsetsAttrs';

export interface UseSafeAreaInsetsProps extends UseSafeAreaInsetsAttrsOptions {
  class?: unknown;
  style?: StyleValue;
}

const props = defineProps<UseSafeAreaInsetsProps>();
defineSlots<{
  default(props: { classes: unknown[]; style: StyleValue }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const insetAttrs = useSafeAreaInsetsAttrs(() => props);
</script>

<template>
  <slot :classes="[insetAttrs.classes, $props.class]" :style="[insetAttrs.style, style]"/>
</template>
