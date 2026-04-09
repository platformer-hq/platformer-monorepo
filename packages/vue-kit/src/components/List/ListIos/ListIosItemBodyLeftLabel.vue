<script setup lang="ts">
import TypographyIos, {
  type TypographyIosProps,
} from '@/components/Typography/TypographyIos/TypographyIos.vue';

defineProps<{
  /**
   * True if the medium font-weight should be applied.
   */
  medium?: boolean;
  maxLines?: TypographyIosProps['maxLines'];
}>();
</script>

<template>
  <TypographyIos
    variant="body"
    class="tgui-list-ios-item-body-left-label"
    :max-lines
    :weight="medium ? 'medium' : undefined"
  >
    <slot />
  </TypographyIos>
</template>

<style>
.tgui-list-ios-item-body-left-label {
  width: 100%;
}
</style>
