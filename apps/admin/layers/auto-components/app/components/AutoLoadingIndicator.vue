<script setup lang="ts">
import type { ColorReferenceAnyColor } from '#colors/utils/utils';
import { LoadingIndicatorAndroid, LoadingIndicatorIos } from '#components';

defineProps<{
  size: number;
  color?: ColorReferenceAnyColor;
}>();

const platform = useTmaPlatform();
</script>

<template>
  <component
    :is="platform.isMappedIos ? LoadingIndicatorIos : LoadingIndicatorAndroid"
    :size
    :style="{color: colorReference(color) || undefined}"
  />
</template>
