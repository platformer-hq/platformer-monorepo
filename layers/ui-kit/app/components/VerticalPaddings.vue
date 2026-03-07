<script setup lang="ts">
import PagePaddings, { type PagePaddingsProps } from './PagePaddings.vue';

defineProps<Pick<PagePaddingsProps, 'as' | 'top' | 'bottom'>>();
</script>

<template>
  <PagePaddings v-bind="$props">
    <slot/>
  </PagePaddings>
</template>
