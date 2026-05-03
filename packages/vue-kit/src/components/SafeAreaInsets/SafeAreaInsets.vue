<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { KnownHtmlTag } from '@/types';

import {
  useSafeAreaInsetsAttrs,
  type UseSafeAreaInsetsAttrsOptions,
} from './composables/useSafeAreaInsetsAttrs';

export interface SafeAreaInsetsProps extends UseSafeAreaInsetsAttrsOptions {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<SafeAreaInsetsProps>(), { as: 'div' });

const element = useTemplateRef<HTMLElement>('root');
defineExpose({ element });

const insetAttrs = useSafeAreaInsetsAttrs(() => props);
</script>

<template>
  <component :is="as" ref="root" :class="insetAttrs.classes">
    <slot/>
  </component>
</template>
