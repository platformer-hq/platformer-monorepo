<script setup lang="ts">
import type { UseSafeAreaInsetsInset, UseSafeAreaInsetsOptions } from '../../composables/useSafeAreaInsets/useSafeAreaInsets';

export type SafeAreaInset = UseSafeAreaInsetsInset;
export interface SafeAreaInsetsProps extends UseSafeAreaInsetsOptions {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}

const { as = 'div', ...props } = defineProps<SafeAreaInsetsProps>();

const element = useTemplateRef<HTMLElement>('root');
defineExpose({ element });

const { classes } = useSafeAreaInsets(() => props);
</script>

<template>
  <component :is="as" ref="root" :class="classes">
    <slot/>
  </component>
</template>
