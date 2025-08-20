<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-vue';
import { useTimeoutFn } from '@vueuse/core';
import { is, literal, looseObject, nullish, string, unknown } from 'valibot';
import { ref, shallowRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ApiError,
  FetchError,
  InvalidDataTypeError,
  InvalidResponseDataError,
  InvalidResponseFormatError,
  isApiError,
  isFetchError,
} from '@/api/errors.js';
import AppFrameBootstrapper from '@/components/AppFrameBootstrapper.vue';
import type { ErrorStatusPageError } from '@/components/ErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';
import { appendRawLaunchParams } from '@/helpers/appendRawLaunchParams.js';

const props = defineProps<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
  rawLaunchParams: string;
  securedRawLaunchParams: string;
}>();
const emit = defineEmits<{
  dataRetrieved: [];
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
const state = shallowRef<{ found: boolean; url?: string | null }>();

const controller = new AbortController();
useTimeoutFn(() => controller.abort(), () => props.loadTimeout);

const { data: requestData, error: requestError } = useQuery({
  queryKey: [
    'app-url',
    props.appId,
    props.apiBaseUrl,
    props.securedRawLaunchParams,
  ] as const,
  async queryFn({ signal, queryKey: [, appId, apiBaseUrl, launchParams] }) {
    const url = new URL(`apps/${appId}/telegram-url`, apiBaseUrl);
    url.searchParams.set('lp', launchParams);
    signal.onabort = controller.abort.bind(controller);

    let response: Response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } catch (e) {
      throw new FetchError(e);
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch (e) {
      throw new InvalidDataTypeError(e);
    }

    if (is(
      looseObject({
        ok: literal(false),
        error: looseObject({ code: string(), message: nullish(string()) }),
      }),
      json,
    )) {
      throw new ApiError(json.error.code, json.error.message);
    }

    if (is(looseObject({ ok: literal(true), data: unknown() }), json)) {
      if (is(looseObject({ url: nullish(string()) }), json.data)) {
        return json.data;
      }
      throw new InvalidResponseDataError(json.data);
    }

    throw new InvalidResponseFormatError(json);
  },
  staleTime: 0,
  retry: (_failureCount, error) => (
    !isTimeoutError(error) && !isApiError(error) && _failureCount < 4
  ),
});

watchEffect(() => {
  if (requestData.value) {
    state.value = { found: true, url: requestData.value.url };
    emit('dataRetrieved');
  }
});

watchEffect(() => {
  if (!requestError.value) {
    return;
  }
  hapticFeedbackNotificationOccurred('error');

  if (!isApiError(requestError.value)) {
    error.value = isTimeoutError(requestError.value)
      ? { type: 'init', timeout: props.initTimeout }
      : { type: 'unknown', cause: requestError.value };
    return;
  }
  if (requestError.value.data.code === 'ERR_APP_NOT_FOUND') {
    state.value = { found: false };
  } else {
    error.value = { type: 'server', cause: requestError.value };
  }
});

watchEffect(() => {
  // The initial URL failed to load, but we have fallback URL to use to try again. The component
  // should complet its lifecycle.
  if (error.value && !props.fallbackUrl) {
    emit('error', { error: error.value });
  }
});

watchEffect(() => {
  // The data fromt the server was retrieved, but the application was not found. The status
  // page must be displayed and the parent component notified about this component completing its
  // lifecycle.
  if (state.value && !state.value.found) {
    emit('ready', {});
  }
});
</script>

<template>
  <AppFrameBootstrapper
    v-if="error && fallbackUrl"
    :load-timeout
    :url="appendRawLaunchParams(fallbackUrl, rawLaunchParams)"
    @error="emit('error', { error, fallbackUrl })"
    @ready="emit('ready', { fallbackUrl })"
  />
  <template v-else-if="state">
    <AppFrameBootstrapper
      v-if="state.url"
      :load-timeout
      :url="appendRawLaunchParams(state.url, rawLaunchParams)"
      @error="error = { type: 'iframe', timeout: $event.timeout}"
      @ready="emit('ready', {})"
    />
    <StatusPage
      v-else
      :title="t(state.found ? 'noAccessTitle' : 'notFoundTitle')"
    >
      {{ t(state.found ? 'noAccessText' : 'notFoundText') }}
    </StatusPage>
  </template>
</template>
