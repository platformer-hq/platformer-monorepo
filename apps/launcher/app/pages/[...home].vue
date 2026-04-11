<!-- eslint-disable vue/no-multiple-template-root vue/multi-word-component-names -->
<script setup lang="ts">
import { hapticFeedback, retrieveRawInitDataFp, retrieveRawLaunchParamsFp } from '@tma.js/sdk-vue';
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

const launcherOptions = ref<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
}>();
const state = ref<LauncherStateState | { kind: 'ready' }>({ kind: 'initial' });

const onLauncherPageLeave = (el: Element, done: () => void) => {
  return el
    .animate({
      clipPath: ['circle(100% at 50% 50%)', 'circle(10% at 50% 50%)', 'circle(0% at 50% 50%)'],
      opacity: [1, 0],
      transform: ['scale(1)', 'scale(1.05)'],
    }, { duration: 300, easing: 'ease-out' })
    .finished
    .then(done);
};

const initDataRaw = ref<string>();
const launchParamsRaw = ref<string>();
const hapticError = () => hapticFeedback.notificationOccurred.ifAvailable('error');

if (import.meta.client) {
  const route = useRoute();

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
  <div class="home-page">
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
        && (state.kind === 'ready' || state.kind === 'loading' || state.kind === 'initial')
      "
      v-bind="launcherOptions"
      :init-data-raw
      :launch-params-raw
      :fallback-url="launcherOptions.fallbackUrl
        ? appendLaunchParams(launcherOptions.fallbackUrl, launchParamsRaw)
        : undefined"
      @ready="state = {kind: 'ready'}"
      @api-timeout="
        state = {kind: 'api-timeout', timeout: $event.timeout};
        hapticError();
      "
      @api-error="
        state = {kind: 'api-error', error: $event.error};
        hapticError();
      "
      @app-http-url="
        state = {kind: 'app-http-url', type: $event.type, url: $event.url};
        if ($event.type === 'error') {
          hapticError();
        }
      "
      @app-data-retrieved="state = {kind: 'loading', step: 'waiting-load'}"
      @start="state = {kind: 'loading', step: 'getting-data'}"
      @app-device-inaccessible="state = {kind: 'app-device-inaccessible'}"
      @app-not-found="state = {kind: 'app-not-found'}"
      @app-error="
        state = {kind: 'app-error'};
        hapticError();
      "
      @app-timeout="
        state = {kind: 'app-timeout'};
        hapticError();
      "
    />
  </div>
</template>

<style>
.home-page {
  height: 100vh;
  width: 100vw;
}
</style>
