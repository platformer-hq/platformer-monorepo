<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface IosChevronTitle1Medium34Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = 34 } = defineProps<IosChevronTitle1Medium34Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 34" :width="size" :height="size"><path fill="currentColor" d="M16.512 18.54q0 .303-.117.562a1.7 1.7 0 0 1-.352.492l-9.129 8.93a1.3 1.3 0 0 1-.96.398q-.375 0-.692-.188a1.3 1.3 0 0 1-.504-.492 1.34 1.34 0 0 1-.176-.68q0-.563.422-.996l8.226-8.027-8.226-8.027q-.422-.434-.422-.985 0-.386.176-.691.188-.304.504-.48.316-.189.691-.188.574 0 .961.387l9.129 8.93q.234.234.352.492.117.257.117.562"/></svg>
</template>