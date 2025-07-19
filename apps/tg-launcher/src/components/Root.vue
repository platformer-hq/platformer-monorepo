<script setup lang="ts">
import type { Logger, Platform } from '@telegram-apps/sdk-vue';

import App, { type AppProps } from '@/components/App.vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
import { provideGlobals } from '@/providers/global.js';
import type { InitialColorsTuple, Locale } from '@/types/common.ts';

interface RootProps extends AppProps {
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Logger;
  platform: Platform;
}

const { platform, locale, logger, initialColors } = defineProps<RootProps>();
provideGlobals({ platform, locale, logger, initialColors });

defineOptions({ inheritAttrs: false })
</script>

<template>
  <ErrorBoundary>
    <App
      :raw-init-data="rawInitData"
      :raw-launch-params="rawLaunchParams"
    />
  </ErrorBoundary>
</template>
