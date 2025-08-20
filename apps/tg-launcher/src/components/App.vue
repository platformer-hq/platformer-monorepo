<script setup lang="ts">
import { ref } from 'vue';

import { extractLauncherOptions } from '@/helpers/extractLauncherOptions.ts';
import { injectLogger } from '@/providers/global';

import AppInitializer from './AppInitializer.vue';
import ErrorStatusPage, { type ErrorStatusPageError } from './ErrorStatusPage.vue';

export interface AppProps {
  rawInitData?: string;
  rawLaunchParams: string;
}

const props = defineProps<AppProps>();

const { forceError } = injectLogger();
const error = ref<ErrorStatusPageError>();

const opts = extractLauncherOptions();
if (!opts.ok) {
  forceError('Launcher options are corrupted:', opts.error);
}
if (!props.rawInitData) {
  forceError('Init data is missing');
}
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
      v-else-if="error"
      :error="error"
      @retry="error = undefined"
    />
    <AppInitializer
      v-else
      v-bind="opts.options"
      :raw-launch-params
      :raw-init-data
      @error="
        if ($event.fallbackUrl) {
          forceError('Fallback URL failed to load:', $event.fallbackUrl, $event.error);
        } else {
          forceError('Failed to load the app:', $event.error);
        }
        error = $event.error;
      "
    />
  </main>
</template>

<style>
.app {
  height: 100%;
}
</style>
