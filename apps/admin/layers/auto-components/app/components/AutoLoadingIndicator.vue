<script setup lang="ts">
import { LoadingIndicatorAndroid, LoadingIndicatorIos } from '@tma.js/vue-kit';

import type { ColorReferenceAnyColor } from '#colors/utils/utils';

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
