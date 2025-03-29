import {
  setDebug,
  initData,
  mountThemeParams,
  init as initSDK,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
  type Platform,
  mockTelegramEnv,
  emitEvent,
  themeParamsState,
  retrieveLaunchParams,
  type ThemeParams,
} from '@telegram-apps/sdk-solid';

import { camelToKebab } from '@/helpers/camelToKebab.js';

export async function init(debug: boolean, platform: Platform) {
  setDebug(debug);
  initSDK();

  // Init Mixpanel.
  import('mixpanel-browser')
    .then(({ default: mixpanel }) => {
      mixpanel.init('cd00b1f58f9d1fab5d5407fadcf2fba9', {
        debug,
        track_pageview: true,
        persistence: 'localStorage',
      });
    })
    .catch(e => {
      console.error('Something went wrong with Mixpanel:', e);
    });

  // Init Sentry.
  import('./sentry.js')
    .then(({ init }) => {
      init({
        dsn: 'https://8888815a88eb8e06bd1ac55195df9ab0@o992980.ingest.us.sentry.io/4508812774473728',
        environment: import.meta.env.MODE,
        debug,
      });
    })
    .catch(e => {
      console.error('Something went wrong with Sentry:', e);
    });

  // Add Eruda if needed.
  debug && import('eruda')
    .then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: 0 });
    })
    .catch(console.error);

  // Initialize required components.
  initData.restore();

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (platform === 'macos') {
    let firstThemeSent = false;
    mockTelegramEnv({
      onEvent(event, next) {
        if (event[0] === 'web_app_request_theme') {
          let tp: ThemeParams = {};
          if (firstThemeSent) {
            tp = themeParamsState();
          } else {
            firstThemeSent = true;
            tp ||= retrieveLaunchParams().tgWebAppThemeParams;
          }
          return emitEvent('theme_changed', { theme_params: tp });
        }

        if (event[0] === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          });
        }
        next();
      },
    });
  }

  await Promise.all([
    mountThemeParams().then(() => {
      bindThemeParamsCssVars();
    }),
    mountViewport().then(() => {
      bindViewportCssVars(prop => {
        const kebabed = camelToKebab(prop);
        return prop.startsWith('safeArea') || prop.startsWith('contentSafeArea')
          ? `--${kebabed}`
          : `--viewport-${kebabed}`;
      });
    }),
  ]);
}