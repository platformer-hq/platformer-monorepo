<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ArrowLeftToRight20Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 20 } = defineProps<ArrowLeftToRight20Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" :width="size" :height="size"><path fill="currentcolor" d="M16.299 8.65a.66.66 0 0 1-.667-.681v-.615l.154-2.557-1.934 2.03-2.248 2.27a.63.63 0 0 1-.469.19c-.41 0-.725-.27-.725-.681 0-.198.073-.374.205-.505l2.256-2.256 2.036-1.927-2.563.147h-.615c-.389 0-.689-.271-.689-.667 0-.395.3-.673.689-.673h4.065c.747 0 1.186.432 1.186 1.179v4.065c0 .38-.286.68-.681.68M8.264 16.7H4.2c-.747 0-1.179-.433-1.179-1.18v-4.065c0-.38.286-.681.674-.681s.666.293.666.681v.615l-.146 2.557 1.926-2.03 2.256-2.27a.6.6 0 0 1 .461-.19c.418 0 .726.27.726.68a.7.7 0 0 1-.198.506L7.122 13.58l-2.03 1.926 2.564-.146h.608c.388 0 .689.27.689.666s-.293.674-.689.674"/></svg>
</template>