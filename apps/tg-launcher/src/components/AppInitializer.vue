<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AppLoader from '@/components/AppLoader.vue';
import { type ErrorStatusPageError } from '@/components/ErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';
import { computeFallbackURL } from '@/helpers/computeFallbackURL.js';
import { secureRawLaunchParams } from '@/helpers/secureRawLaunchParams.js';
import { injectLogger } from '@/providers/global.js';

interface ErrorEvent {
  error: ErrorStatusPageError;
  fallbackUrl?: string;
}

defineEmits<{
  error: [ErrorEvent];
}>();

const { fallbackUrl, rawLaunchParams, rawInitData } = defineProps<{
  appId: number;
  apiBaseUrl: string;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
  rawInitData: string;
  rawLaunchParams: string;
}>();

const logger = injectLogger();
const ready = ref(false);
const step = ref<'getting-data' | 'waiting-load'>('getting-data');
const { t } = useI18n({
  messages: {
    en: {
      gettingData: 'Getting app data',
      waitingLoad: 'Waiting for the app to be ready',
    },
    ru: {
      gettingData: 'Получаем информацию о приложении',
      waitingLoad: 'Ожидаем загрузки приложения',
    },
  },
});
const computedFallbackURL = fallbackUrl
  ? computeFallbackURL(fallbackUrl, rawLaunchParams)
  : undefined;
const securedRawLaunchParams = secureRawLaunchParams(rawLaunchParams, rawInitData);

const onReady = ({ fallbackUrl }: { fallbackUrl?: string }) => {
  fallbackUrl && logger.forceWarn('Platformer failed to load. Used fallback:', fallbackUrl);
  logger.log('Removing the loader');
  ready.value = true;
};

const onStatusPageExit = (el: Element, done: () => void) => {
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
</script>

<template>
  <Transition @leave="onStatusPageExit">
    <StatusPage
      v-if="!ready"
      class="app-initializer__status"
      state="loading"
    >
      {{ t(step === 'getting-data' ? 'gettingData' : 'waitingLoad') }}
    </StatusPage>
  </Transition>
  <AppLoader
    :app-id="appId"
    :api-base-url="apiBaseUrl"
    :init-timeout="initTimeout"
    :load-timeout="loadTimeout"
    :raw-launch-params="rawLaunchParams"
    :secured-raw-launch-params="securedRawLaunchParams"
    :fallback-url="computedFallbackURL"
    @error="$emit('error', $event)"
    @ready="onReady"
    @app-data-retrieved="step = 'waiting-load'"
  />
</template>

<style lang="scss">
@use "sass:math";

.app-initializer__status {
  $shiftSize: 5%;
  background-image: linear-gradient(
    to bottom,
    transparent,
    var(--theme-bg-color) $shiftSize,
    var(--theme-bg-color) 100% - $shiftSize,
    transparent
  );
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100% * math.div(100%, 100%-$shiftSize*2);
}
</style>
