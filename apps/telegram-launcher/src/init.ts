import {
  setDebug,
  restoreInitData,
  init as initSDK,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
  setMiniAppHeaderColor,
  mountMiniApp,
  setMiniAppBottomBarColor,
  setMiniAppBackgroundColor,
  mockTelegramEnv,
  type ThemeParams,
  themeParamsState,
  retrieveLaunchParams,
  emitEvent,
  themeParamsBackgroundColor,
  miniAppHeaderColor,
  miniAppBackgroundColor,
  miniAppBottomBarColor,
  type MiniAppHeaderColor,
  type BackgroundColor,
  type BottomBarColor,
} from '@telegram-apps/sdk-solid';
import { lazySentryInit, formatViewportCssVar, lazeErudaInit } from 'shared';
import type { BrowserOptions } from '@sentry/solid';

/**
 * Initializes the SDK.
 * @param options - execution options.
 */
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
  sentry: BrowserOptions;
}): Promise<{
  initialColors: [
    header: MiniAppHeaderColor,
    background: BackgroundColor,
    bottomBar: BottomBarColor
  ];
}> {
  setDebug(options.debug);
  initSDK();

  // Init Sentry.
  void lazySentryInit(options.sentry);
  options.eruda && void lazeErudaInit();

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
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
          return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 });
        }

        next();
      },
    });
  }

  // Initialize required components.
  restoreInitData();

  await Promise.all([
    mountMiniApp().then(() => {
      bindThemeParamsCssVars();
    }),
    mountViewport().then(() => {
      bindViewportCssVars(formatViewportCssVar);
    }),
  ]);

  function applyAndSub<T>(
    signal: {
      (): T;
      sub: (listener: (value: T) => void) => VoidFunction;
    },
    fn: (value: T) => void,
  ) {
    fn(signal());
    signal.sub(fn);
  }

  const initialColors: [
    header: MiniAppHeaderColor,
    background: BackgroundColor,
    bottomBar: BottomBarColor
  ] = [miniAppHeaderColor(), miniAppBackgroundColor(), miniAppBottomBarColor()];

  applyAndSub(themeParamsBackgroundColor, color => {
    if (color) {
      setMiniAppHeaderColor(color);
      setMiniAppBackgroundColor(color);
      setMiniAppBottomBarColor(color);
    }
  });

  return { initialColors };
}