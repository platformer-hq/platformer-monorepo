<script setup lang="ts">
import PagePaddings, { type PagePaddingsProps } from './PagePaddings.vue';

withDefaults(defineProps<Pick<PagePaddingsProps, 'as' | 'top' | 'bottom'>>(), {
  top: undefined,
  bottom: undefined,
});
</script>

<template>
  <PagePaddings v-bind="$props" :left="false" :right="false">
    <slot/>
  </PagePaddings>
</template>
