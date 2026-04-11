<script setup lang="ts">
import {
  backButton,
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
  toRGBFull,
} from '@tma.js/sdk-vue';
import { formatMiniAppCssVar, formatThemeParamsCssVar, formatViewportCssVar } from '@workspace/tma';
import * as fp from 'fp-ts';
import type { TransitionProps } from 'vue';

defineSlots<{
  default(props: { transition: TransitionProps }): unknown;
}>();
const emit = defineEmits<{
  ready: [];
}>();

// Apply polyfills for @tma.js/sdk-vue.
callOnce(applyPolyfills);

const tmaStore = useTmaStore();
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
  const { startParam, launchParams, platform } = tmaStore;

  // Configure @tma.js SDK.
  setDebug(startParam.includes('debug') || import.meta.env.DEV);
  setTargetOrigin(import.meta.env.DEV ? '*' : 'https://tgl.mini-apps.store');
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

  // Initialize required components.
  initData.restore();
  backButton.mount();
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
  viewport.expand();

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

  // We require this text color parts to make "secondary-accent-color" to work properly.
  subAndApplyToValue(themeParams.accentTextColor, color => {
    if (color) {
      const pureColor = toRGBFull(color).slice(1);
      document.documentElement.style.setProperty(
        '--accent-text-color-parts',
        new Array(3)
          .fill('')
          .map((_, idx) => parseInt(pureColor.slice(idx * 2, (idx + 1) * 2), 16))
          .join(', '),
      );
    }
  });
});

// Configuring the current locale.
await callOnce(async () => {
  let locale = await fp.function.pipe(
    csGetLocale(),
    fp.taskEither.matchW(
      e => {
        console.error('Error when restoring locale from the cloud storage', e);
      },
      locale => locale,
    ),
  )();
  if (!locale) {
    const languageCode = tmaStore.launchParams.tgWebAppData?.user?.language_code;
    if (isKnownLocale(languageCode)) {
      locale = languageCode;
    }
  }
  await setLocale(locale || 'en');
});

onMounted(() => {
  emit('ready');
});
</script>

<template>
  <UsePageTransition v-slot="transition">
    <slot :transition="transition"/>
  </UsePageTransition>
</template>
