<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

import ErrorStatusPage from '@/components/ErrorStatusPage.vue';

const error = ref<Error | undefined>();
onErrorCaptured(err => {
  error.value = err;
});
const resetError = () => {
  error.value = undefined;
};
</script>

<template>
  <ErrorStatusPage
    v-if="error"
    :error="{ type: 'unknown', cause: error }"
    @retry="resetError"
  />
  <slot v-else />
</template>
