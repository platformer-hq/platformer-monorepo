<script setup lang="ts">
import type { Logger, Platform } from '@telegram-apps/sdk-vue';

import { extractLauncherOptions } from '@/helpers/extractLauncherOptions.js';
import { provideGlobals } from '@/providers/global.js';
import type { InitialColorsTuple, Locale } from '@/types/common.ts';
import AppInitializer from './AppInitializer.vue';
import ErrorBoundary from './ErrorBoundary.vue';
import ErrorStatusPage from './ErrorStatusPage.vue';

const { platform, locale, logger, initialColors } = defineProps<{
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Logger;
  platform: Platform;
  rawInitData?: string;
  rawLaunchParams: string;
}>();
provideGlobals({ platform, locale, logger, initialColors });

defineOptions({ inheritAttrs: false });

const opts = extractLauncherOptions();
</script>

<template>
  <main class="root">
    <ErrorBoundary>
      <ErrorStatusPage
        v-if="!opts.ok"
        :error="{ type: 'config-invalid', cause: opts.error }"
      />
      <ErrorStatusPage
        v-else-if="!rawInitData"
        :error="{ type: 'init-data-missing' }"
      />
      <AppInitializer
        v-else
        :app-id="opts.options.appId"
        :fallback-url="opts.options.fallbackUrl"
        :init-timeout="opts.options.initTimeout"
        :load-timeout="opts.options.loadTimeout"
        :raw-launch-params="rawLaunchParams"
        :raw-init-data="rawInitData"
      />
    </ErrorBoundary>
  </main>
</template>

<style>
.root {
  height: 100%;
}
</style>
