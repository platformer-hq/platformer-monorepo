<!-- eslint-disable vue/no-multiple-template-root vue/multi-word-component-names -->
<script setup lang="ts">
import { retrieveRawInitDataFp, retrieveRawLaunchParamsFp } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';

import prerenderScriptUrl from '@/scripts/prerender?iife-url';
import type { LauncherStateState } from '~/components/LauncherState.vue';

useHead({
  script: [{ src: prerenderScriptUrl, tagPosition: 'bodyOpen' }],
  meta: [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, user-scalable=no',
  }],
});

const launcherOptions = extractLauncherOptions(useRoute().query);
const state = ref<LauncherStateState | { kind: 'ready' }>(
  launcherOptions.ok
    ? { kind: 'loading', step: 'getting-data' }
    : { kind: 'error', params: { kind: 'config-invalid', error: launcherOptions.error } },
);
// const state = ref<LauncherStateState | { kind: 'ready' }>({
//   kind: 'warning',
//   params: { kind: 'http-url' },
// });

// TODO: Error boundary

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

const initDataRaw = ref<string | undefined>();
const launchParamsRaw = ref<string | undefined>();

if (import.meta.client) {
  onMounted(() => {
    fp.function.pipe(
      fp.either.Do,
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
          state.value = { kind: 'error', params: { kind: 'init-data-missing', error: e } };
        },
        result => {
          initDataRaw.value = result.initDataRaw;
          launchParamsRaw.value = result.launchParamsRaw;
        },
      ),
    );
  });
}
</script>

<template>
  <div>
    <Transition :css="false" @leave="onLauncherPageLeave">
      <LauncherState v-if="state.kind !== 'ready'" :state="state"/>
    </Transition>
    <AppLoader
      v-if="launcherOptions.ok && initDataRaw && launchParamsRaw"
      v-bind="launcherOptions.options"
      :init-data-raw="initDataRaw"
      :launch-params-raw="launchParamsRaw"
      :fallback-url="launcherOptions.options.fallbackUrl
        ? computeFallbackUrl(launcherOptions.options.fallbackUrl, launchParamsRaw)
        : undefined"
      @ready="state = {kind: 'ready'}"
      @warning="state = {kind: 'warning', params: $event}"
    />
  </div>
</template>
