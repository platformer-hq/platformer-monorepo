import {
  applyPolyfills,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  bridgeLogger,
  createLogger,
  emitEvent,
  init as initSDK,
  isViewportExpanded,
  isViewportStable,
  miniAppBackgroundColorRGB,
  miniAppBottomBarColorRGB,
  miniAppHeaderColor,
  mockTelegramEnv,
  mountMainButton,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountViewport,
  restoreInitData,
  sdkLogger,
  setDebug,
  setMainButtonParams,
  setMiniAppBackgroundColor,
  setMiniAppBottomBarColor,
  setMiniAppHeaderColor,
  themeParamsBackgroundColor,
  themeParamsState,
  viewportHeight,
  viewportWidth,
} from '@telegram-apps/sdk-vue';
import { formatThemeParamsCssVar, formatViewportCssVar } from 'shared';

import type { InitialColors } from '@/types/common.js';

/**
 * Initializes the SDK.
 */
export async function init({ debug, ...options }: {
  /**
   * Should the debug mode be enabled.
   */
  debug: boolean;
  /**
   * Should eruda be enabled.
   *
   * Enabling this option, to make sure, that all logs were captured, the launcher will wait for
   * eruda to be downloaded, and then the app will be rendered.
   */
  eruda: boolean;
  /**
   * Applies some mocks related to incorrect Telegram for macOS client behavior.
   */
  mockForMacOS: boolean;
  /**
   * Applies some mocks related to incorrect Telegram Web K client behavior.
   */
  mockForWebK: boolean;
}): Promise<{ initialColors: InitialColors }> {
  applyPolyfills();
  setDebug(debug);
  bridgeLogger.set(createLogger('🚀Bridge', {
    textColor: 'white',
    bgColor: '#7688FF',
    shouldLog: debug,
  }));
  sdkLogger.set(createLogger('🚀SDK', {
    textColor: 'white',
    bgColor: '#7688FF',
    shouldLog: debug,
  }));
  initSDK();

  // Init eruda.
  options.eruda && await import('eruda').then(({ default: eruda }) => {
    eruda.init();
    eruda.position({ x: window.innerWidth - 50, y: window.innerHeight / 2 });
  });

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
        if (mockForMacOS) {
          if (event[0] === 'web_app_request_theme') {
            return emitEvent('theme_changed', { theme_params: themeParamsState() });
          }
          if (event[0] === 'web_app_request_viewport') {
            return emitEvent('viewport_changed', {
              height: viewportHeight(),
              width: viewportWidth(),
              is_expanded: isViewportExpanded(),
              is_state_stable: isViewportStable(),
            });
          }
        }
        if (event[0] === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets);
        }
        next();
      },
    });
  }

  // Initialize required components.
  restoreInitData();

  if (mountViewport.isAvailable()) {
    await mountViewport({ timeout: 3000 });
    bindViewportCssVars(formatViewportCssVar);
  }
  if (mountThemeParamsSync.isAvailable()) {
    mountThemeParamsSync();
    bindThemeParamsCssVars(formatThemeParamsCssVar);
  }
  if (mountMainButton.isAvailable()) {
    mountMainButton();
    setMainButtonParams({ isVisible: false });
  }
  mountMiniAppSync.ifAvailable();

  const initialColors: InitialColors = {
    header: miniAppHeaderColor(),
    background: miniAppBackgroundColorRGB(),
    bottomBar: miniAppBottomBarColorRGB(),
  };

  const desiredColor = themeParamsBackgroundColor();
  if (desiredColor) {
    setMiniAppHeaderColor(desiredColor);
    setMiniAppBackgroundColor(desiredColor);
    setMiniAppBottomBarColor(desiredColor);
  }

  return { initialColors };
}
