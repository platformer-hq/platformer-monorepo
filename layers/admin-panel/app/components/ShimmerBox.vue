<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core';

import { ShimmerBox, type ShimmerBoxProps } from '#layers/ui-kit';

interface Props extends Omit<ShimmerBoxProps, 'bgColor' | 'shimmerColor'> {
  /**
   * Color to apply to the shimmer background.
   * @default 'quaternary'
   */
  color?: 'tertiary' | 'quaternary' | 'transparent';
}

const { color = 'quaternary' } = defineProps<Props>();
const isDark = useIsDark();
</script>

<template>
  <ShimmerBox
    v-bind="reactiveOmit($props, 'color')"
    :bg-color="color === 'transparent' ? undefined : colorReference(`${color}-fill-bg`)"
    :shimmer-color="isDark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.3)'"
  />
</template>
