<script setup lang="ts">
import { useSafeAreaInsets, type UseSafeAreaInsetsInset, type UseSafeAreaInsetsOptions } from '@/composables/useSafeAreaInsets/useSafeAreaInsets';

/**
 * A component providing a functionality related to setting paddings connected with
 * the device's safe area.
 */
export type UseSafeAreaInset = UseSafeAreaInsetsInset;
export interface UseSafeAreaInsetsProps extends UseSafeAreaInsetsOptions {
  class?: unknown;
}

const props = defineProps<UseSafeAreaInsetsProps>();
defineSlots<{
  default(props: { classes: unknown[] }): unknown;
}>();
defineOptions({ inheritAttrs: false });

const { classes } = useSafeAreaInsets(() => props);
</script>

<template>
  <slot :classes="[classes, $props.class]"/>
</template>
