<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-vue';
import { looseObject, nullish, string } from 'valibot';
import { onUnmounted, ref, shallowRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { isApiError, isFetchError } from '@/api/errors.js';
import { fetchApi } from '@/api/fetchApi.js';
import AppFrameBootstrapper from '@/components/AppFrameBootstrapper.vue';
import type { ErrorStatusPageError } from '@/components/ErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';
import { appendRawLaunchParams } from '@/helpers/appendRawLaunchParams.js';

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
  error: [{
    error: ErrorStatusPageError;
    fallbackUrl?: string;
  }];
  ready: [{ fallbackUrl?: string }];
}>();

const isTimeoutError = (e: unknown): boolean => {
  return isFetchError(e) && e.cause instanceof AbortSignal;
};

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
const { signal: timeoutSignal } = controller;
const timeoutId = setTimeout(() => {
  controller.abort();
}, loadTimeout);
onUnmounted(() => {
  clearTimeout(timeoutId);
});

const { data: requestData, error: requestError } = useQuery<
  { url?: string | null },
  unknown,
  { url?: string | null },
  readonly ['app-url', appId: number, apiBaseUrl: string, launchParams: string]
>({
  queryKey: ['app-url', appId, apiBaseUrl, securedRawLaunchParams],
  queryFn({ signal, queryKey: [, appId, apiBaseUrl, launchParams] }) {
    const url = new URL(`apps/${appId}/telegram-url`, apiBaseUrl);
    url.searchParams.set('lp', launchParams);
    signal.onabort = reason => {
      controller.abort(reason);
    };
    return fetchApi(url, looseObject({ url: nullish(string()) }), { signal: timeoutSignal });
  },
  staleTime: 0,
  retry: (_failureCount, error) => (
    !isTimeoutError(error) && !isApiError(error) && _failureCount < 4
  ),
});

watchEffect(() => {
  if (requestData.value) {
    appData.value = { found: true, url: requestData.value.url };
    emit('appDataRetrieved');
    return;
  }
  if (requestError.value) {
    hapticFeedbackNotificationOccurred('error');

    if (isApiError(requestError.value)) {
      if (requestError.value.data.code === 'ERR_APP_NOT_FOUND') {
        appData.value = { found: false };
      } else {
        error.value = { type: 'server', cause: requestError.value };
      }
      return;
    }
    error.value = isTimeoutError(requestError.value)
      ? { type: 'init', timeout: initTimeout }
      : { type: 'unknown', cause: requestError.value };
  }
});
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
        :title="t(appData.found ? 'noAccessTitle' : 'notFoundTitle')"
        @vue:mounted="$emit('ready', {})"
      >
        {{ t(appData.found ? 'noAccessText' : 'notFoundText') }}
      </StatusPage>
    </template>
  </template>
</template>
