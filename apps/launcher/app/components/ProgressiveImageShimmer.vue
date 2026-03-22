<script lang="ts" setup>
import { ProgressiveImageShimmer, type ProgressiveImageShimmerProps } from '#packages/ui-kit';

interface Props extends Omit<ProgressiveImageShimmerProps, 'bgColor' | 'shimmerColor'> {
  color?: ColorReferenceAnyColor | 'transparent';
}

withDefaults(defineProps<Props>(), { color: 'quaternary-fill-bg' });

const isDark = useIsDark();
</script>

<template>
  <ProgressiveImageShimmer
    v-bind="$props"
    :bg-color="color === 'transparent' ? undefined : colorReference(color)"
    :shimmer-color="isDark ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.3)'"
  />
</template>
