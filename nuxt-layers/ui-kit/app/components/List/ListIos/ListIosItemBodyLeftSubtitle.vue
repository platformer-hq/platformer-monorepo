<script setup lang="ts">
import type {
  TypographyIosProps,
} from '#ui-kit/components/Typography/TypographyIos/TypographyIos.vue';

defineProps<{
  maxLines?: TypographyIosProps['maxLines'];
}>();
</script>

<template>
  <TypographyIos variant="subheadline2" :max-lines class="tgui-list-ios-item-body-left-subtitle">
    <slot />
  </TypographyIos>
</template>

<style>
.tgui-list-ios-item-body-left-subtitle {
  width: 100%;
  color: var(--tgui-list-ios-item-body-left-subtitle-color);
}
</style>
