<script setup lang="ts">
import { isTimeoutError } from 'better-promises';
import { looseObject, nullish, string } from 'valibot';
import { onUnmounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchApi, isApiError, useSWR } from 'vue-swr-shared';

import AppFrameBootstrapper from '@/components/AppFrameBootstrapper.vue';
import type { ErrorStatusPageError } from '@/components/ErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';
import { appendRawLaunchParams } from '@/helpers/appendRawLaunchParams.js';

interface ErrorEvent {
  error: ErrorStatusPageError;
  fallbackUrl?: string;
}

const {
  fallbackUrl,
  appId,
  securedRawLaunchParams,
  initTimeout,
  loadTimeout,
  apiBaseUrl,
} = defineProps<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
  rawLaunchParams: string;
  securedRawLaunchParams: string;
}>();
const emit = defineEmits<{
  appDataRetrieved: [];
  error: [ErrorEvent];
  ready: [{ fallbackUrl?: string }];
}>();

const { t } = useI18n({
  messages: {
    en: {
      notFoundTitle: 'App not found',
      notFoundText: 'This application was not found',
      noAccessTitle: 'Nothing here',
      noAccessText: 'The application is inaccessible on your device',
    },
    ru: {
      notFoundTitle: 'Приложение не найдено',
      notFoundText: 'Это приложение не было найдено',
      noAccessTitle: 'Тут пусто',
      noAccessText: 'Приложение недоступно на Вашем устройстве',
    },
  },
});
const error = ref<ErrorStatusPageError>();
const appData = shallowRef<{ found: boolean; url?: string | null }>();

const controller = new AbortController();
const { signal } = controller;
const timeoutId = setTimeout(() => {
  controller.abort();
}, loadTimeout);
onUnmounted(() => {
  clearTimeout(timeoutId);
});

useSWR<{ url?: string | null }, {
  appId: number;
  apiBaseUrl: string;
  launchParams: string;
  signal?: AbortSignal;
}, Error>(
  ({ appId, apiBaseUrl, launchParams }) => `app-url-${appId}-${apiBaseUrl}-${launchParams}`,
  async ({ apiBaseUrl, appId, launchParams, signal }) => {
    const url = new URL(`apps/${appId}/telegram-url`, apiBaseUrl);
    url.searchParams.set('lp', launchParams);
    return fetchApi(url, looseObject({ url: nullish(string()) }), { signal });
  },
  {
    args: { appId, apiBaseUrl, launchParams: securedRawLaunchParams, signal },
    freshAge: 0,
    onSuccess({ data }) {
      appData.value = { found: true, url: data.url };
      emit('appDataRetrieved');
    },
    onError({ error: err }) {
      if (isApiError(err)) {
        if (err.data.code === 'ERR_APP_NOT_FOUND') {
          appData.value = { found: false };
        } else {
          error.value = { type: 'server', cause: err };
        }
        return;
      }
      error.value = isTimeoutError(error)
        ? { type: 'init', timeout: initTimeout }
        : { type: 'unknown', cause: error };
    },
    shouldRetry(error) {
      return !isTimeoutError(error) && (
        !isApiError(error)
        || error.data.code !== 'ERR_APP_NOT_FOUND'
      );
    },
    staleAge: 0,
  },
);
</script>

<template>
  <template v-if="error">
    <AppFrameBootstrapper
      v-if="fallbackUrl"
      :load-timeout="loadTimeout"
      :url="appendRawLaunchParams(fallbackUrl, rawLaunchParams)"
      @error="$emit('error', { error, fallbackUrl })"
      @ready="$emit('ready', { fallbackUrl })"
    />
    <div
      v-else
      v-show="false"
      @vue:mounted="$emit('error', { error })"
    />
  </template>
  <template v-else-if="appData">
    <AppFrameBootstrapper
      v-if="appData.url"
      :load-timeout="loadTimeout"
      :url="appendRawLaunchParams(appData.url, rawLaunchParams)"
      @error="error = { type: 'iframe', timeout: $event.timeout}"
      @ready="$emit('ready', {})"
    />
    <template v-else>
      <StatusPage
        :text="t(appData.found ? 'noAccessText' : 'notFoundText')"
        :title="t(appData.found ? 'noAccessTitle' : 'notFoundTitle')"
        @vue:mounted="$emit('ready', {})"
      />
    </template>
  </template>
</template>
