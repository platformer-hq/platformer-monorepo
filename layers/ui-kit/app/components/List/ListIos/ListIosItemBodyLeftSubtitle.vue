<script setup lang="ts">
import type { TypographyIosProps } from '../../Typography/TypographyIos/TypographyIos.vue';

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
@use "@/domains/styles/mixins";

.list-ios-item-body-left-subtitle {
  width: 100%;
  color: var(--list-ios-item-body-left-subtitle-color);
}
</style>
