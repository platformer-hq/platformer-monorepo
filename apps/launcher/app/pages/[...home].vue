<script setup lang="ts">
import { hapticFeedback, retrieveRawLaunchParamsFp } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';
import { getRequestURL } from 'h3';
import * as v from 'valibot';

import type { LauncherStateState } from '@/components/LauncherState/LauncherState.vue';
import prerenderScriptUrl from '@/scripts/prerender?iife-url';

definePageMeta({ scrollToTop: false });

useHead({
  script: [{ src: prerenderScriptUrl, tagPosition: 'bodyOpen' }],
  meta: [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, user-scalable=no',
  }],
});

const route = useRoute();
const requestEvent = useRequestEvent();

const launcherOptions = fp.function.pipe(
  extractLauncherOptions(route.query),
  fp.either.map(options => ({
    ...options,
    apiBaseUrl: options.apiBaseUrl ?? (
      import.meta.env.DEV
        ? new URL(
          '/api/',
          requestEvent ? getRequestURL(requestEvent)?.origin : window.location.origin,
        ).toString()
        : 'https://mini-apps.store/api/'
    ),
    initTimeout: options.initTimeout ?? 5000,
    loadTimeout: options.loadTimeout ?? 10000,
    queryLp: options.queryLp ?? false,
  })),
  fp.either.matchW(
    e => ({ valid: false as const, error: e }),
    v => ({ valid: true as const, value: v }),
  ),
);

const state = ref<LauncherStateState | { kind: 'ready' }>(
  launcherOptions.valid
    ? { kind: 'initial' }
    : { kind: 'config-invalid', error: launcherOptions.error },
);
const launchParamsRaw = ref<string>();

const splashScreen = launcherOptions.valid
  ? await fp.function.pipe(
    fp.taskEither.tryCatch(
      () => {
        return $fetch.raw(new URL(
          `apps/${launcherOptions.value.appId}/splash-screen`,
          launcherOptions.value.apiBaseUrl,
        ).toString(), { timeout: 3000 });
      },
      e => e as Error,
    ),
    fp.taskEither.matchW(
      e => {
        console.error('Failed to retrieve splash screen data', e);
      },
      response => {
        const parseResult = v.safeParse(
          v.looseObject({ iconUrl: v.nullish(v.string()) }),
          response._data,
        );
        if (parseResult.success) {
          return parseResult.output;
        }
        console.error('Failed to parse splash screen response', parseResult.issues);
      },
    ),
  )()
  : null;

onMounted(() => {
  fp.function.pipe(
    retrieveRawLaunchParamsFp(),
    fp.either.match(
      e => {
        state.value = { kind: 'init-data-missing', error: e };
      },
      lp => {
        launchParamsRaw.value = lp;
      },
    ),
  );
});

onErrorCaptured(error => {
  state.value = { kind: 'unknown-error', error };
  return false;
});

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
const hapticError = () => hapticFeedback.notificationOccurred.ifAvailable('error');
</script>

<template>
  <div class="home-page">
    <Transition :css="false" @leave="onLauncherPageLeave">
      <LauncherState
        v-if="state.kind !== 'ready'"
        :icon-url="splashScreen?.iconUrl || undefined"
        :state
        @retry="state = {kind: 'loading', step: 'getting-data'}"
      />
    </Transition>
    <AppLoader
      v-if="
        launcherOptions.valid
        && launchParamsRaw
        && (state.kind === 'ready' || state.kind === 'loading' || state.kind === 'initial')
      "
      v-bind="launcherOptions.value"
      :launch-params-raw
      :fallback-url="launcherOptions.value.fallbackUrl
        ? appendLaunchParams(
          launcherOptions.value.fallbackUrl,
          launchParamsRaw,
          launcherOptions.value.queryLp
        )
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
