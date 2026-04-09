<script setup lang="ts">
import TypographyIos, { type TypographyIosProps } from '@/components/Typography/TypographyIos/TypographyIos.vue';
import { bem } from '@/utils/bem';

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
@use "@/scss/mixins" as mixins;

.list-ios-item-body-left-label {
  width: 100%;
}
</style>
