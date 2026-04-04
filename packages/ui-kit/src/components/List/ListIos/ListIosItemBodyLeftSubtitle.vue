<script setup lang="ts">
import TypographyIos, { type TypographyIosProps } from '@/components/Typography/TypographyIos/TypographyIos.vue';
import { bem } from '@/utils/bem';

defineProps<{
  maxLines?: TypographyIosProps['maxLines'];
}>();
const { b } = bem('list-ios-item-body-left-subtitle');
</script>

<template>
  <TypographyIos variant="subheadline2" :max-lines :class="b()">
    <slot />
  </TypographyIos>
</template>

<style lang="scss">
@use "@/scss/mixins" as mixins;

.list-ios-item-body-left-subtitle {
  width: 100%;
  color: var(--list-ios-item-body-left-subtitle-color);
}
</style>
