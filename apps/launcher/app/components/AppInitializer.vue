<script setup lang="ts">
import {
  applyPolyfills,
  setDebug,
  setTargetOrigin,
  init,
  request2,
  themeParams,
  viewport,
  initData,
  swipeBehavior,
  miniApp,
} from '@tma.js/sdk-vue';

const emit = defineEmits<{ ready: [] }>();

// Apply polyfills for @tma.js/sdk-vue.
callOnce(applyPolyfills);

const tmaStore = useTmaStore();
const router = useRouter();
const { setLocale } = useI18n();

// Init eruda.
await callOnce(async () => {
  if (
    tmaStore.startParam.includes('eruda')
    || (
      import.meta.env.DEV
        && !['tdesktop', 'web', 'weba', 'webk', 'macos'].includes(tmaStore.platform.raw)
    )
  ) {
    await import('eruda').then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: window.innerHeight / 2 });
    });
  }
});

// Initializing the SDK.
await callOnce(async () => {
  const { launchParams, platform } = tmaStore;

  setDebug(tmaStore.startParam.includes('debug') || import.meta.env.DEV);
  setTargetOrigin(import.meta.env.DEV ? '*' : 'https://web.telegram.org');
  init({
    themeParams: platform.raw === 'ios'
      // We use this hack to fix a bug related to dark themes in iOS. For some reason, the initial
      // theme params state there is invalid and contains secondaryBgColor = bgColor. Requesting
      // theme params, the client sends as new ones with valid values.
      ? (await request2('web_app_request_theme', 'theme_changed')).theme_params
      : launchParams.tgWebAppThemeParams,
    version: launchParams.tgWebAppVersion,
    isInlineMode: !!launchParams.tgWebAppBotInline,
  });

  // Intercept broken mini apps events and respond with a correct data.
  interceptBrokenEvents({ macOS: platform.raw === 'macos', webK: platform.raw === 'web' });

  // Initialize required components.
  initData.restore();
  if (swipeBehavior.mount.isSupported()) {
    swipeBehavior.mount();
    swipeBehavior.disableVertical();
  }
  themeParams.mount();
  themeParams.bindCssVars(formatThemeParamsCssVar);
  miniApp.mount();
  miniApp.bindCssVars(formatMiniAppCssVar);
  await viewport.mount();
  viewport.bindCssVars(formatViewportCssVar);

  // Set global properties required by styles - platform identifier and scheme.
  function subAndApplyToValue<T>(
    signal: {
      (): T;
      sub: (listener: (value: T) => void) => VoidFunction;
    },
    fn: (value: T) => void,
  ) {
    signal.sub(fn);
    fn(signal());
  }

  subAndApplyToValue(themeParams.isDark, isDark => {
    document.documentElement.dataset['theme'] = isDark ? 'dark' : 'light';
  });
});

// Configuring the current locale.
await callOnce(async () => {
  const languageCode = tmaStore.launchParams.tgWebAppData?.user?.language_code;
  await setLocale(isKnownLocale(languageCode) ? languageCode : 'en');
});

// Setting the initial route.
await callOnce(async () => {
  if (!isPageReload()) {
    await router.replace({});
  }
});

onMounted(() => {
  emit('ready');
});
</script>

<template>
  <slot/>
</template>
