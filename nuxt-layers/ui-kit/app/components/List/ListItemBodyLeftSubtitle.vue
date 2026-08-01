<script setup lang="ts">
import { usePlatform } from '~/_composables/usePlatform';
import type { TypographyProps } from '~/components/VTypography/VTypography.vue';

const platform = usePlatform();

defineProps<{
  maxLines?: TypographyProps['maxLines'];
}>();
</script>

<template>
  <VTypography
    :variant="platform === 'android' ? 'subheadline1' : 'subheadline2'"
    :max-lines
    class="list-item-body-left-subtitle"
  >
    <slot />
  </VTypography>
</template>

<style>
.list-item-body-left-subtitle {
  width: 100%;
  color: var(--subtitle-text-color);
}
</style>
