<script setup lang="ts">
import type { Logger, Platform } from '@telegram-apps/sdk-vue';
import { onErrorCaptured, ref } from 'vue';

import type { InitialColorsTuple, Locale } from '@/types/common.ts';
import { provideGlobals } from '@/providers/global.js';
import ErrorStatusPage from '@/components/ErrorStatusPage.vue';
import App, { type AppProps } from '@/components/App.vue';

interface RootProps extends AppProps {
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Logger;
  platform: Platform;
}

const { platform, locale, logger, initialColors } = defineProps<RootProps>();

const error = ref<Error | undefined>();
onErrorCaptured(err => {
  error.value = err;
});
const resetError = () => {
  error.value = undefined;
};

provideGlobals({
  platform,
  locale,
  logger,
  initialColors,
});

</script>

<template>
  <ErrorStatusPage
    v-if="error"
    :error="{ type: 'unknown', cause: error }"
    @retry="resetError"
  />
  <App
    v-else
    :raw-init-data="rawInitData"
    :raw-launch-params="rawLaunchParams"
  />
</template>
