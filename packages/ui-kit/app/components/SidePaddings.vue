<script setup lang="ts">
import PagePaddings, { type PagePaddingsProps } from './PagePaddings.vue';

withDefaults(defineProps<Pick<PagePaddingsProps, 'as' | 'left' | 'right'>>(), {
  left: undefined,
  right: undefined,
});
</script>

<template>
  <PagePaddings v-bind="$props" :top="false" :bottom="false">
    <slot/>
  </PagePaddings>
</template>
