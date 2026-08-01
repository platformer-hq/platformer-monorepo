<script setup lang="ts">
import { hapticFeedback, retrieveLaunchParamsFp, retrieveRawInitDataFp, retrieveRawLaunchParamsFp, type LaunchParams } from '@tma.js/sdk-vue';
import { TimeoutError } from '@workspace/errors';
import * as fp from 'fp-ts';

import prerenderScriptUrl from '@/scripts/prerender?iife-url';

import AppFrame from './_app-frame/AppFrame.vue';
import { useAppData } from './_composables/useAppData';
import { useAppUrl } from './_composables/useAppUrl';
import { useLauncherOptions } from './_composables/useLauncherOptions';
import LauncherState, { type LauncherStateState } from './_launcher-state/LauncherState.vue';
import { appendLaunchParams } from './_utils/appendLaunchParams';

useHead({
  script: [{ src: prerenderScriptUrl, tagPosition: 'bodyOpen' }],
  meta: [{
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, user-scalable=no',
  }],
});

const launcherOptions = useLauncherOptions();

const launchParams = ref<LaunchParams>();
const launchParamsRaw = ref<string>();
const initDataRaw = ref<string>();
const frameSrc = ref<{ kind: 'original' | 'fallback'; src: string }>();
const state = ref<LauncherStateState | { kind: 'ready' }>(
  launcherOptions.value.kind === 'error'
    ? { kind: 'config-invalid', error: launcherOptions.value.error }
    : { kind: 'initial' },
);

onErrorCaptured(error => {
  state.value = { kind: 'unknown-error', error };
  return false;
});

const initDataSanitized = computed(() => {
  if (!initDataRaw.value) {
    return;
  }
  const searchParams = new URLSearchParams(initDataRaw.value);
  searchParams.delete('hash');
  return searchParams.toString();
});
const extractedOptions = computed(() => (
  launcherOptions.value.kind === 'options'
    ? launcherOptions.value.options
    : undefined
));

const handleApiError = (error: Error) => {
  state.value = TimeoutError.is(error)
    ? { kind: 'api-timeout', timeout: error.data.timeout }
    : { kind: 'api-error', error };
  if (extractedOptions.value?.fallbackUrl) {
    frameSrc.value = { kind: 'fallback', src: extractedOptions.value.fallbackUrl };
  }
  hapticError();
};

const { data: appData, isLoading: isLoadingAppData } = useAppData({
  params() {
    if (extractedOptions.value) {
      const { appId, initTimeout } = extractedOptions.value;
      return { appId, timeout: initTimeout };
    }
  },
  onError: handleApiError,
});
const { refetch: refetchAppUrl } = useAppUrl({
  params() {
    return extractedOptions.value && !!launchParams.value && !!initDataSanitized.value
      ? {
        appId: extractedOptions.value.appId,
        timeout: extractedOptions.value.initTimeout,
        platform: launchParams.value.tgWebAppPlatform,
        initData: initDataSanitized.value,
      }
      : undefined;
  },
  onStarted() {
    state.value = { kind: 'loading', step: 'getting-data' };
  },
  onSuccess({ app }) {
    if (!app) {
      state.value = { kind: 'app-not-found' };
      return;
    }
    if (!app.url) {
      state.value = { kind: 'app-device-inaccessible' };
      return;
    }
    const appUrl = appendLaunchParams(
      app.url,
      launchParamsRaw.value || '',
      extractedOptions.value?.queryLp || false,
    );
    if (!app.url.startsWith('http://')) {
      state.value = { kind: 'loading', step: 'waiting-load' };
      frameSrc.value = { kind: 'original', src: appUrl };
      return;
    }
    let isWeb = true;
    try {
      isWeb = window.self !== window.top;
    } catch {
      /* none */
    }
    state.value = {
      kind: 'app-http-url',
      type: isWeb ? 'error' : 'warning',
      url: appUrl,
    };
    if (state.value.type === 'error') {
      hapticError();
    }
  },
  onError: handleApiError,
});

onMounted(() => {
  fp.function.pipe(
    fp.either.Do,
    fp.either.bindW('launchParams', retrieveLaunchParamsFp),
    fp.either.bindW('launchParamsRaw', retrieveRawLaunchParamsFp),
    fp.either.bindW('initData', () => {
      return fp.function.pipe(
        retrieveRawInitDataFp(),
        fp.either.map(fp.option.match(() => '', v => v)),
      );
    }),
    fp.either.match(
      e => {
        state.value = { kind: 'init-data-missing', error: e };
      },
      result => {
        launchParams.value = result.launchParams;
        launchParamsRaw.value = result.launchParamsRaw;
        initDataRaw.value = result.initData;
      },
    ),
  );
});

const hapticError = () => hapticFeedback.notificationOccurred.ifAvailable('error');
const { b, e } = bem('home-page');
</script>

<template>
  <div :class="b()">
    <Transition :name="e('transition')">
      <LauncherState
        v-if="state.kind !== 'ready'"
        :data="isLoadingAppData ? undefined : {
          iconUrl: appData?.app?.splashScreenIconUrl || undefined
        }"
        :state
        @retry="refetchAppUrl()"
      />
    </Transition>
    <AppFrame
      v-if="frameSrc && extractedOptions"
      :init-timeout="extractedOptions.loadTimeout"
      :src="frameSrc.src"
      @ready="state = {kind: 'ready'}"
      @error="
        state = {kind: 'app-error'};
        hapticError();
      "
      @timeout="
        state = {kind: 'app-timeout', timeout: extractedOptions.loadTimeout};
        hapticError();
      "
    />
  </div>
</template>

<style lang="scss">
.home-page {
  height: 100vh;
  width: 100vw;

  &__transition {
    &-leave-active {
      @keyframes home-page-loader-transition {
        from {
          clip-path: circle(100% at 50% 50%);
          opacity: 1;
          transform: scale(1);
        }
        50% {
          clip-path: circle(10% at 50% 50%);
        }
        to {
          clip-path: circle(0% at 50% 50%);
          opacity: 0;
          transform: scale(1.05);
        }
      }
      animation: home-page-loader-transition 300ms ease-out;
    }
  }
}
</style>
