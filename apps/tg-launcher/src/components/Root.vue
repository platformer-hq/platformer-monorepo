<script setup lang="ts">
import type { Logger, Platform } from '@telegram-apps/sdk-vue';

import { provideGlobals } from '@/providers/global.js';
import type { InitialColorsTuple, Locale } from '@/types/common.js';
import App, { type AppProps } from './App.vue';
import ErrorBoundary from './ErrorBoundary.vue';

interface RootProps extends AppProps {
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Logger;
  platform: Platform;
}

defineOptions({ inheritAttrs: false });
const { platform, locale, logger, initialColors } = defineProps<RootProps>();
provideGlobals({ platform, locale, logger, initialColors });
</script>

<template>
  <ErrorBoundary>
    <App
      :raw-init-data="rawInitData"
      :raw-launch-params="rawLaunchParams"
    />
  </ErrorBoundary>
</template>
