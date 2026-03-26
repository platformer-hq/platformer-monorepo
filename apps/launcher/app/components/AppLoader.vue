<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core';
import * as fp from 'fp-ts';
import * as v from 'valibot';

const props = defineProps<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
  initDataRaw: string;
  launchParamsRaw: string;
}>();
const emit = defineEmits<{
  // error: [{ kind: 'init-data-missing' }];
  ready: [];
  warning: [{ kind: 'http-url' }];
}>();

const controller = new AbortController();
const { stop: cleanupTimeout } = useTimeoutFn(() => controller.abort(), () => props.loadTimeout);

const launcherParamsRawSecured = computed(() => {
  return secureRawLaunchParams(props.launchParamsRaw, props.initDataRaw);
});

useQuery({
  key: () => [props.appId, props.apiBaseUrl, launcherParamsRawSecured.value],
  query({ signal }) {
    return throwifyAnyEither(
      fp.function.pipe(
        fp.taskEither.tryCatch(() => {
          const url = new URL(
            `apps/${props.appId}/telegram-url`,
            new URL(props.apiBaseUrl, window.location.origin),
          );
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
          if (v.is(
            v.looseObject({
              ok: v.literal(false),
              error: v.looseObject({ code: v.string(), message: v.nullish(v.string()) }),
            }),
            json,
          )) {
            return fp.taskEither.left(new ApiError(json.error.code, json.error.message));
          }
          if (v.is(v.looseObject({ ok: v.literal(true), data: v.unknown() }), json)) {
            if (v.is(v.looseObject({ url: v.nullish(v.string()) }), json.data)) {
              return fp.taskEither.right(json.data);
            }
            return fp.taskEither.left(new InvalidResponseDataError(json.data));
          }
          return fp.taskEither.left(new InvalidResponseDataError(json));
        }),
      ),
    );
  },
});
</script>

<template>
  App loader
</template>
