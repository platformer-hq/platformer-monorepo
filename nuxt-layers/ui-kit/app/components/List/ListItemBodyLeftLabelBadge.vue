<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform';
import type { BadgeProps } from '~ui-kit/components/VBadge.vue';

defineProps<{
  palette?: BadgeProps['palette'];
}>();

const platform = usePlatform();

const { b } = bem('list-item-body-left-label-badge');
</script>

<template>
  <VBadge :class="b(platform)" v-bind="$props" size="xs">
    <slot/>
  </VBadge>
</template>

<style lang="scss">
.list-item-body-left-label-badge {
  margin-left: 4px;
  &--ios {
    margin-top: -3px;
  }
  &--android {
    margin-top: -2px;
  }
}
</style>
