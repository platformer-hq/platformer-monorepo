<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

import ErrorStatusPage from '@/components/ErrorStatusPage.vue';

const error = ref<Error | undefined>();
onErrorCaptured(err => {
  error.value = err;
});
</script>

<template>
  <ErrorStatusPage
    v-if="error"
    :error="{ type: 'unknown', cause: error }"
    @retry="error = undefined"
  />
  <slot v-else />
</template>
