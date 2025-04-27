import {
  setDebug,
  restoreInitData,
  init as initSDK,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
  setMiniAppHeaderColor,
  setMiniAppBottomBarColor,
  setMiniAppBackgroundColor,
  mockTelegramEnv,
  themeParamsState,
  emitEvent,
  themeParamsBackgroundColor,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountMainButton,
  miniAppHeaderColor,
  miniAppBackgroundColorRGB,
  miniAppBottomBarColorRGB,
  bridgeLogger,
  sdkLogger,
  createLogger,
} from '@telegram-apps/sdk-solid';
import { formatThemeParamsCssVar, formatViewportCssVar } from 'shared';
import { lazySentryInit, lazyErudaInit } from 'utils';
import type { BrowserOptions } from '@sentry/solid';

import type { InitialColorsTuple } from '@/types/common.js';

/**
 * Initializes the SDK.
 * @param options - execution options.
 */
export async function init({ debug, ...options }: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
  mockForWebK: boolean;
  sentry: BrowserOptions;
}): Promise<{ initialColors: InitialColorsTuple }> {
  setDebug(debug);
  bridgeLogger.set(createLogger('Bridge (Platformer)', {
    textColor: 'white',
    bgColor: '#00bddf',
    shouldLog: debug,
  }));
  sdkLogger.set(createLogger('SDK (Platformer)', {
    textColor: 'white',
    bgColor: '#6700c8',
    shouldLog: debug,
  }));
  initSDK();

  // Init Sentry and eruda.
  void lazySentryInit(options.sentry);
  options.eruda && void lazyErudaInit();

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  //
  // In turn, Telegram Web K doesn't respond to both
  // "web_app_request_safe_area" and "web_app_request_content_safe_area" methods.
  const { mockForMacOS, mockForWebK } = options;
  if (mockForMacOS || mockForWebK) {
    const noInsets = { left: 0, top: 0, right: 0, bottom: 0 };
    mockTelegramEnv({
      onEvent(event, next) {
        if (mockForMacOS && event[0] === 'web_app_request_theme') {
          return emitEvent('theme_changed', { theme_params: themeParamsState() });
        }
        if (mockForWebK && event[0] === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets);
        }
        if (event[0] === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', noInsets);
        }
        next();
      },
    });
  }

  // Initialize required components.
  restoreInitData();

  if (mountThemeParamsSync.isAvailable()) {
    mountThemeParamsSync();
    bindThemeParamsCssVars(formatThemeParamsCssVar);
  }
  if (mountViewport.isAvailable()) {
    await mountViewport();
    bindViewportCssVars(formatViewportCssVar);
  }
  mountMainButton.ifAvailable();
  mountMiniAppSync.ifAvailable();

  const initialColors: InitialColorsTuple = [
    miniAppHeaderColor(),
    miniAppBackgroundColorRGB(),
    miniAppBottomBarColorRGB(),
  ];

  const desiredColor = themeParamsBackgroundColor();
  if (desiredColor) {
    setMiniAppHeaderColor(desiredColor);
    setMiniAppBackgroundColor(desiredColor);
    setMiniAppBottomBarColor(desiredColor);
  }

  return { initialColors };
}