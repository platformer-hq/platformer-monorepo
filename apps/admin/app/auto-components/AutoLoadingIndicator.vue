<script setup lang="ts">
import { LoadingIndicatorAndroid, LoadingIndicatorIos } from '@workspace/ui-kit';

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
