<script setup lang="ts">
import {
  useSafeAreaInsetsAttrs,
  type UseSafeAreaInsetsAttrsOptions,
} from '~ui-kit/composables/useSafeAreaInsetsAttrs/useSafeAreaInsetsAttrs';
import type { KnownHtmlTag } from '~ui-kit/types';

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
