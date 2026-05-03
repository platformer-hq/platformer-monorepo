<script setup lang="ts">
import {
  useSafeAreaInsetsAttrs,
  type UseSafeAreaInsetsAttrsOptions,
} from './composables/useSafeAreaInsetsAttrs';

export interface UseSafeAreaInsetsAttrsProps extends UseSafeAreaInsetsAttrsOptions {
  class?: unknown;
}

const props = defineProps<UseSafeAreaInsetsAttrsProps>();
defineSlots<{
  default(props: { classes: unknown[] }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const insetAttrs = useSafeAreaInsetsAttrs(() => props);
</script>

<template>
  <slot :classes="[insetAttrs.classes, $props.class]"/>
</template>
