<!-- eslint-disable vue/no-multiple-template-root vue/multi-word-component-names -->
<script setup lang="ts">
import { retrieveRawInitDataFp, retrieveRawLaunchParamsFp } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';
import * as v from 'valibot';

import type { LauncherStateState } from '@/components/LauncherState/LauncherState.vue';
import prerenderScriptUrl from '@/scripts/prerender?iife-url';

useHead({
  script: [{ src: prerenderScriptUrl, tagPosition: 'bodyOpen' }],
  meta: [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, user-scalable=no',
  }],
});

const route = useRoute();
const launcherOptions = ref<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
}>();
const state = ref<LauncherStateState | { kind: 'ready' }>({
  kind: 'loading',
  step: 'getting-data',
});
// const state = ref<LauncherStateState | { kind: 'ready' }>({
//   kind: 'warning',
//   params: { kind: 'http-url' },
// });

const onLauncherPageLeave = (el: Element, done: () => void) => {
  return el
    .animate({
      clipPath: ['circle(100% at 50% 50%)', 'circle(20% at 50% 50%)'],
      opacity: [1, 0],
      transform: ['scale(1)', 'scale(1.05)'],
      backgroundSize: ['100% 111%', '100% 100%', '100% 100%'],
    }, { duration: 200, easing: 'ease-out' })
    .finished
    .then(done);
};

const initDataRaw = ref<string>();
const launchParamsRaw = ref<string>();

if (import.meta.client) {
  onMounted(() => {
    fp.function.pipe(
      fp.either.Do,
      fp.either.bindW('launcherOptions', () => extractLauncherOptions(route.query)),
      fp.either.bindW('initDataRaw', retrieveRawInitDataFp),
      fp.either.bindW('launchParamsRaw', retrieveRawLaunchParamsFp),
      fp.either.map(result => ({
        ...result,
        initDataRaw: fp.function.pipe(
          result.initDataRaw,
          fp.option.match(() => undefined, v => v),
        ),
      })),
      fp.either.match(
        e => {
          state.value = v.isValiError(e)
            ? { kind: 'config-invalid', error: e }
            : { kind: 'init-data-missing', error: e };
        },
        result => {
          initDataRaw.value = result.initDataRaw;
          launchParamsRaw.value = result.launchParamsRaw;
          launcherOptions.value = result.launcherOptions;
        },
      ),
    );
  });
}

onErrorCaptured(error => {
  state.value = { kind: 'unknown-error', error };
  return false;
});
</script>

<template>
  <div>
    <Transition :css="false" @leave="onLauncherPageLeave">
      <LauncherState
        v-if="state.kind !== 'ready'"
        :state
        @retry="state = {kind: 'loading', step: 'getting-data'}"
      />
    </Transition>
    <AppLoader
      v-if="
        launcherOptions
        && initDataRaw
        && launchParamsRaw
        && (state.kind === 'ready' || state.kind === 'loading')
      "
      v-bind="launcherOptions"
      :init-data-raw
      :launch-params-raw
      :fallback-url="launcherOptions.fallbackUrl
        ? appendLaunchParams(launcherOptions.fallbackUrl, launchParamsRaw)
        : undefined"
      @ready="state = {kind: 'ready'}"
      @api-timeout="state = {kind: 'api-timeout', timeout: $event.timeout}"
      @api-error="state = {kind: 'api-error', error: $event.error}"
      @app-http-url="state = {
        kind: 'app-http-url',
        type: $event.type,
        url: $event.url
      }"
      @app-data-retrieved="state = {kind: 'loading', step: 'waiting-load'}"
      @app-device-inaccessible="state = {kind: 'app-device-inaccessible'}"
      @app-not-found="state = {kind: 'app-not-found'}"
      @app-error="state = {kind: 'app-error'}"
      @app-timeout="state = {kind: 'app-timeout'}"
    />
  </div>
</template>
