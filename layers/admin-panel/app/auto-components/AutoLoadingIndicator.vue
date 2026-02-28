<script setup lang="ts">
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
    :color="colorReference(color) || undefined"
  />
</template>
