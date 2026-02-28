<script lang="ts" setup>
import type { UiShimmerProps } from '~/components/UiShimmer.vue';

import type { AutoTypographyVariant } from './AutoTypography/AutoTypography.vue';

interface Props extends Omit<UiShimmerProps, 'height' | 'borderRadius'> {
  /**
   * Original text variant.
   */
  variant: AutoTypographyVariant;
}

const { variant, as, width, ...rest } = defineProps<Props>();

// FIXME: This one should be reworked.
</script>

<template>
  <AutoTypography :as :variant="variant" :style="{width: toPx(width)}">
    <UiShimmer v-bind="rest" as="span" class="auto-text-shimmer__shimmer" :border-radius="4">
      &nbsp;
    </UiShimmer>
  </AutoTypography>
</template>

<style>
.auto-text-shimmer__shimmer {
  display: inline-block;
  line-height: calc(100% - 4px);
  width: 100%;
}
</style>
