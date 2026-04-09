<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
  useSafeAreaInsets,
  type UseSafeAreaInsetsOptions,
} from '@/composables/useSafeAreaInsets/useSafeAreaInsetsAttrs';
import type { KnownHtmlTag } from '@/types';

export interface SafeAreaInsetsProps extends UseSafeAreaInsetsOptions {
  /**
   * @default 'div'
   */
  as?: KnownHtmlTag;
}

const props = withDefaults(defineProps<SafeAreaInsetsProps>(), { as: 'div' });

const element = useTemplateRef<HTMLElement>('root');
defineExpose({ element });

const insetAttrs = useSafeAreaInsets(() => props);
</script>

<template>
  <component :is="as" ref="root" :class="insetAttrs.classes" :style="insetAttrs.style">
    <slot/>
  </component>
</template>
