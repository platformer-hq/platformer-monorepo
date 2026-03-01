<script setup lang="ts">
import {
  backButton,
  applyPolyfills,
  setDebug,
  setTargetOrigin,
  init,
  request2,
  mockTelegramEnv,
  emitEvent,
  themeParams,
  viewport,
  initData,
  swipeBehavior,
  miniApp,
} from '@tma.js/sdk-vue';
import { function as fn, taskEither } from 'fp-ts';
import type { TransitionProps } from 'vue';

import { UseIosViewTransition, UseAndroidViewTransition } from '#components';

defineSlots<{
  default(props: { transition: TransitionProps }): unknown;
}>();
const emit = defineEmits<{
  ready: [];
}>();

// Apply polyfills for @tma.js/sdk-vue.
callOnce(applyPolyfills);

const tmaStore = useTmaStore();
const router = useRouter();
const { setLocale } = useI18n();

// Initializing the SDK.
await callOnce(async () => {
  /**
   * Converts value from camel case to kebab case.
   * @param value - value to convert.
   */
  const camelToKebab = (value: string): string => {
    return value.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  };

  const { startParam, launchParams, platform } = tmaStore;

  // Init eruda.
  if (
    startParam.includes('eruda')
    || (import.meta.env.DEV && !['tdesktop', 'web', 'weba', 'webk', 'macos'].includes(platform.raw))
  ) {
    await import('eruda').then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: window.innerHeight / 2 });
    });
  }

  // Configure @tma.js SDK.
  setDebug(startParam.includes('debug') || import.meta.env.DEV);
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

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even respond to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  //
  // In turn, Telegram Web K doesn't respond to both "web_app_request_safe_area" and
  // "web_app_request_content_safe_area" methods. That's why we have to intercept some of these
  // calls in order to get an expected behavior.
  const mockForMacOS = platform.raw === 'macos';
  const mockForWebK = platform.raw === 'web';
  if (mockForMacOS || mockForWebK) {
    const noInsets = { left: 0, top: 0, right: 0, bottom: 0 };
    mockTelegramEnv({
      onEvent(event, next) {
        if (mockForMacOS) {
          if (event.name === 'web_app_request_theme') {
            return emitEvent('theme_changed', { theme_params: themeParams.state() });
          }
          if (event.name === 'web_app_request_viewport') {
            return emitEvent('viewport_changed', {
              height: viewport.height(),
              width: viewport.width(),
              is_expanded: viewport.isExpanded(),
              is_state_stable: viewport.isStable(),
            });
          }
        }
        if (mockForWebK) {
          if (event.name === 'web_app_request_safe_area') {
            return emitEvent('safe_area_changed', noInsets);
          }
        }
        if (event.name === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets);
        }
        next();
      },
    });
  }

  // Initialize required components.
  initData.restore();
  backButton.mount();

  if (swipeBehavior.mount.isSupported()) {
    swipeBehavior.mount();
    swipeBehavior.disableVertical();
  }

  themeParams.mount();
  themeParams.bindCssVars(key => `--${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`);

  miniApp.mount();
  miniApp.bindCssVars(key => `--app-${camelToKebab(key)}`);

  await viewport.mount();
  viewport.bindCssVars(key => {
    const kebabed = camelToKebab(key);
    return key.startsWith('safeArea') || key.startsWith('contentSafeArea')
      ? `--${kebabed}`
      : `--viewport-${kebabed}`;
  });
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
});

// Configuring the current locale.
await callOnce(async () => {
  let locale = await fn.pipe(
    csGetLocale(),
    taskEither.matchW(
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

// Setting the initial route.
await callOnce(async () => {
  if (!isPageReload()) {
    await router.replace({ name: PAGE_NAME_MAIN });
  }
});

onMounted(() => {
  emit('ready');
});
</script>

<template>
  <component
    :is="tmaStore.platform.isMappedIos ? UseIosViewTransition : UseAndroidViewTransition"
    v-slot="transition"
  >
    <slot :transition="transition"/>
  </component>
</template>
