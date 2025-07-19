<script setup lang="ts">
import AppInitializer from '@/components/AppInitializer.vue';
import ErrorStatusPage from '@/components/ErrorStatusPage.vue';
import { extractLauncherOptions } from '@/helpers/extractLauncherOptions.js';

export interface AppProps {
  rawInitData?: string;
  rawLaunchParams: string;
}

defineProps<AppProps>();
defineOptions({ inheritAttrs: false });

const opts = extractLauncherOptions();

// todo: provide gql options
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
    <AppInitializer
      v-else
      :app-id="opts.options.appId"
      :fallback-url="opts.options.fallbackUrl"
      :init-timeout="opts.options.initTimeout"
      :load-timeout="opts.options.loadTimeout"
      :raw-launch-params="rawLaunchParams"
      :raw-init-data="rawInitData"
    />
  </main>
</template>

<style>
.app {
  height: 100%;
}
</style>
