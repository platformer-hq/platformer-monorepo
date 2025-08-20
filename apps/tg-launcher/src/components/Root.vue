<script setup lang="ts">
import type { Logger, Platform } from '@telegram-apps/sdk-vue';

import { provideGlobals } from '@/providers/global.js';
import type { InitialColors, Locale } from '@/types/common.js';

import App, { type AppProps } from './App.vue';
import ErrorBoundary from './ErrorBoundary.vue';

interface RootProps extends AppProps {
  initialColors: InitialColors;
  locale: Locale;
  logger: Logger;
  platform: Platform;
}

const { platform, locale, logger, initialColors } = defineProps<RootProps>();
provideGlobals({ platform, locale, logger, initialColors });
</script>

<template>
  <ErrorBoundary>
    <App
      :raw-init-data
      :raw-launch-params
    />
  </ErrorBoundary>
</template>
