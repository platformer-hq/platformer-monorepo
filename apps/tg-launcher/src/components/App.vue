<script setup lang="ts">
import { ref } from 'vue';
import { provideGqlOptions } from 'vue-swr-gql-shared';

import { extractLauncherOptions } from '@/helpers/extractLauncherOptions.ts';
import { injectLogger } from '@/providers/global';
import AppInitializer from './AppInitializer.vue';
import ErrorStatusPage, { type ErrorStatusPageError } from './ErrorStatusPage.vue';

export interface AppProps {
  rawInitData?: string;
  rawLaunchParams: string;
}

defineOptions({ inheritAttrs: false });
const { rawInitData } = defineProps<AppProps>();

const { forceError } = injectLogger();
const initError = ref<ErrorStatusPageError>();

const opts = extractLauncherOptions();
if (!opts.ok) {
  forceError('Launcher options are corrupted:', opts.error);
} else {
  provideGqlOptions({ endpoint: opts.options.apiBaseUrl });
}
if (!rawInitData) {
  forceError('Init data is missing');
}

const onError = ({ error, fallbackUrl }: {
  error: ErrorStatusPageError;
  fallbackUrl?: string;
}) => {
  if (fallbackUrl) {
    forceError('Fallback URL failed to load:', fallbackUrl, error);
  } else {
    forceError('Failed to load the app:', error);
  }
  initError.value = error;
};
</script>

<template>
  <main class="app">
    <ErrorStatusPage
      v-if="!opts.ok"
      :error="{ type: 'config-invalid', cause: opts.error }"
    />
    <ErrorStatusPage
      v-else-if="!rawInitData"
      :error="{ type: 'init-data-missing' }"
    />
    <ErrorStatusPage
      v-else-if="initError"
      :error="initError"
      @retry="initError = undefined"
    />
    <AppInitializer
      v-else
      :app-id="opts.options.appId"
      :fallback-url="opts.options.fallbackUrl"
      :init-timeout="opts.options.initTimeout"
      :load-timeout="opts.options.loadTimeout"
      :raw-launch-params="rawLaunchParams"
      :raw-init-data="rawInitData"
      @error="onError"
    />
  </main>
</template>

<style>
.app {
  height: 100%;
}
</style>
