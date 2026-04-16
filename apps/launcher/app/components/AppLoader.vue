<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core';
import { throwifyAnyEither } from '@workspace/utils';
import * as fp from 'fp-ts';
import * as v from 'valibot';

const props = defineProps<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string;
  initTimeout: number;
  loadTimeout: number;
  launchParamsRaw: string;
  queryLp: boolean;
}>();
const emit = defineEmits<{
  ready: [];
  apiError: [{ error: Error }];
  apiTimeout: [{ timeout: number }];
  appHttpUrl: [{ url: string; type: 'error' | 'warning' }];
  start: [];
  appDataRetrieved: [];
  appDeviceInaccessible: [];
  appNotFound: [];
  appTimeout: [];
  appError: [];
}>();

const frameUrl = ref<{ kind: 'original' | 'fallback'; src: string }>();

const isTimeoutError = (e: unknown) => {
  return FetchError.is(e) && e.cause instanceof AbortSignal;
};
const isAppNotFoundError = (e: unknown) => {
  return ApiError.is(e) && e.data.code === 'ERR_APP_NOT_FOUND';
};
const controller = new AbortController();
const { stop: cleanupTimeout } = useTimeoutFn(
  () => controller.abort(),
  () => props.loadTimeout,
);

const launchParamsQuery = computed(() => new URLSearchParams(props.launchParamsRaw));
const initDataSecured = computed(() => {
  const initData = new URLSearchParams(launchParamsQuery.value.get('tgWebAppData') || '');
  initData.delete('hash');
  return initData.toString();
});

const { data, isPending, error } = useQuery({
  key: () => [props.appId, props.apiBaseUrl, launcherParamsRawSecured.value],
  query({ signal }) {
    return throwifyAnyEither(
      fp.function.pipe(
        fp.taskEither.tryCatch(() => {
          const url = new URL(`apps/${props.appId}/telegram-url`, props.apiBaseUrl);
          url.searchParams.set('lp', launcherParamsRawSecured.value);
          signal.onabort = controller.abort.bind(controller);

          return fetch(url.toString(), { signal: controller.signal });
        }, e => new FetchError(e)),
        fp.taskEither.chainW(resposne => {
          return fp.taskEither.tryCatch(
            () => resposne.json(),
            e => new InvalidDataTypeError(e),
          );
        }),
        fp.taskEither.chainW(json => {
          if (
            !v.is(v.variant('ok', [
              v.looseObject({
                ok: v.literal(false),
                error: v.looseObject({
                  code: v.string(),
                  message: v.nullish(v.string()),
                }),
              }),
              v.looseObject({
                ok: v.literal(true),
                data: v.unknown(),
              }),
            ]), json)
          ) {
            return fp.taskEither.left(new InvalidResponseDataError(json));
          }
          if (!json.ok) {
            return fp.taskEither.left(new ApiError(json.error.code, json.error.message));
          }
          if (v.is(v.looseObject({ url: v.optional(v.string()) }), json.data)) {
            return fp.taskEither.right(json.data);
          }
          return fp.taskEither.left(new InvalidResponseDataError(json.data));
        }),
      ),
    );
  },
  retry: (failureCount, error) => (
    // The error should not be a timeout error.
    !isTimeoutError(error)
    // The error should not indicate that the app was not found.
    && !isAppNotFoundError(error)
    // Not more than 3 retries.
    && failureCount < 4
  ),
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

watch(isPending, isPending => {
  if (!isPending) {
    cleanupTimeout();
  }
});

watch(isPending, (isPending, prevIsPending) => {
  if (!prevIsPending && isPending) {
    emit('start');
  }
}, { immediate: true });

watch(data, data => {
  if (!data) {
    return;
  }
  if (!data.url) {
    return emit('appDeviceInaccessible');
  }
  if (data.url.startsWith('http://')) {
    let isWeb = true;
    try {
      isWeb = window.self !== window.top;
    } catch {
      /* none */
    }
    return emit('appHttpUrl', {
      url: appendLaunchParams(data.url, props.launchParamsRaw, props.queryLp),
      type: isWeb ? 'error' : 'warning',
    });
  }
  emit('appDataRetrieved');
  frameUrl.value = {
    kind: 'original',
    src: appendLaunchParams(data.url, props.launchParamsRaw, props.queryLp),
  };
});

watch([
  error,
  () => ({
    fallbackUrl: props.fallbackUrl,
    loadTimeout: props.loadTimeout,
  }),
], ([error, { fallbackUrl, loadTimeout }]) => {
  if (!error) {
    return;
  }
  if (isAppNotFoundError(error)) {
    return emit('appNotFound');
  }
  if (!fallbackUrl) {
    if (isTimeoutError(error)) {
      return emit('apiTimeout', { timeout: loadTimeout });
    }
    return emit('apiError', { error });
  }
  frameUrl.value = { kind: 'fallback', src: fallbackUrl };
});
</script>

<template>
  <AppFrame
    v-if="frameUrl"
    :init-timeout
    :src="frameUrl.src"
    @ready="$emit('ready')"
    @error="$emit('appError')"
    @timeout="$emit('appTimeout')"
  />
</template>
