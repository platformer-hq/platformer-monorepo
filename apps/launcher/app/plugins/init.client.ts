import { isPageReload } from '@platformer/navigation';
import {
  formatMiniAppCssVar,
  formatThemeParamsCssVar,
  formatViewportCssVar,
  interceptBrokenEvents,
} from '@platformer/tma';
import {
  applyPolyfills,
  setDebug,
  setTargetOrigin,
  init,
  request2,
  themeParams,
  viewport,
  initData,
  miniApp,
  retrieveLaunchParams,
} from '@tma.js/sdk-vue';

export default defineNuxtPlugin({
  name: 'init',
  async setup(app) {
    // Apply polyfills for @tma.js/sdk-vue.
    applyPolyfills();

    const {
      tgWebAppPlatform,
      tgWebAppThemeParams,
      tgWebAppStartParam,
      tgWebAppVersion,
      tgWebAppBotInline,
      tgWebAppData,
    } = retrieveLaunchParams();

    // Init eruda.
    if (
      tgWebAppStartParam?.includes('eruda')
      || (
        import.meta.env.DEV && !['tdesktop', 'web', 'weba', 'webk', 'macos'].includes(tgWebAppPlatform)
      )
    ) {
      await import('eruda').then(({ default: eruda }) => {
        eruda.init();
        eruda.position({ x: window.innerWidth - 50, y: window.innerHeight / 2 });
      });
    }

    setDebug(tgWebAppStartParam?.includes('debug') || import.meta.env.DEV);
    setTargetOrigin(import.meta.env.DEV ? '*' : 'https://web.telegram.org');
    init({
      themeParams: tgWebAppPlatform === 'ios'
        // We use this hack to fix a bug related to dark themes in iOS. For some reason, the initial
        // theme params state there is invalid and contains secondaryBgColor = bgColor. Requesting
        // theme params, the client sends as new ones with valid values.
        ? (await request2('web_app_request_theme', 'theme_changed')).theme_params
        : tgWebAppThemeParams,
      version: tgWebAppVersion,
      isInlineMode: !!tgWebAppBotInline,
    });

    // Intercept broken mini apps events and respond with a correct data.
    interceptBrokenEvents({
      macOS: tgWebAppPlatform === 'macos',
      webK: tgWebAppPlatform === 'web',
    });

    const initialColors = {
      header: miniApp.headerColor(),
      background: miniApp.bgColor(),
      bottomBar: miniApp.bottomBarColor(),
    };

    // Initialize required components.
    initData.restore();
    themeParams.mount();
    themeParams.bindCssVars(formatThemeParamsCssVar);
    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
      miniApp.bindCssVars(formatMiniAppCssVar);
      miniApp.setHeaderColor.ifAvailable('bg_color');
      miniApp.setBgColor.ifAvailable('bg_color');
      miniApp.setBottomBarColor.ifAvailable('bg_color');
    }
    await viewport.mount();
    viewport.bindCssVars(formatViewportCssVar);

    // Configure the current locale.
    const languageCode = tgWebAppData?.user?.language_code;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (app.$i18n as any).setLocale(
      languageCode === 'en' || languageCode === 'ru' ? languageCode : 'en',
    );

    // Remove the hash part.
    if (!isPageReload()) {
      await navigateTo({ replace: true });
    }
    return {
      provide: {
        init: {
          initialColors,
        },
      },
    };
  },
});
