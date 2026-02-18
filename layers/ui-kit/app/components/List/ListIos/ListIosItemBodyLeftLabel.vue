<script setup lang="ts">
import type { TypographyIosProps } from '../../Typography/TypographyIos/TypographyIos.vue';

defineProps<{
  /**
   * True if the medium font-weight should be applied.
   */
  medium?: boolean;
  maxLines?: TypographyIosProps['maxLines'];
}>();
const { b } = bem('list-ios-item-body-left-label');
</script>

<template>
  <TypographyIos
    variant="body"
    :class="b()"
    :max-lines
    :weight="medium ? 'medium' : undefined"
  >
    <slot />
  </TypographyIos>
</template>

<style lang="scss">
@use "@/domains/styles/mixins";

.list-ios-item-body-left-label {
  width: 100%;
}
</style>
