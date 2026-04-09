<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
  useSafeAreaInsetsAttrs,
  type UseSafeAreaInsetsAttrsOptions,
} from '@/composables/useSafeAreaInsetsAttrs/useSafeAreaInsetsAttrs';
import type { KnownHtmlTag } from '@/types';

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
  <component :is="as" ref="root" :class="insetAttrs.classes" :style="insetAttrs.style">
    <slot/>
  </component>
</template>
