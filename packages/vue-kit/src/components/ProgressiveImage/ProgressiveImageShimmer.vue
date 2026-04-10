<script lang="ts" setup>
import ShimmerBox, { type ShimmerBoxProps } from '@/components/ShimmerBox.vue';

export type ProgressiveImageShimmerProps = ShimmerBoxProps;

defineProps<ProgressiveImageShimmerProps>();
</script>

<template>
  <ShimmerBox v-bind="$props" class="tgui-progressive-image-shimmer"/>
</template>

<style>
.tgui-progressive-image-shimmer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
