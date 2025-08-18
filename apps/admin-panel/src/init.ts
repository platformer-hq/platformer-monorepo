import {
  bindMiniAppCssVars,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  disableVerticalSwipes,
  init as initSDK,
  isThemeParamsDark,
  mountBackButton,
  mountMainButton,
  mountMiniAppSync,
  mountSecondaryButton,
  mountSwipeBehavior,
  mountViewport,
  restoreInitData,
  setDebug,
  setMiniAppBackgroundColor,
  setMiniAppBottomBarColor,
  setMiniAppHeaderColor,
  targetOrigin,
  themeParamsSecondaryBackgroundColor,
} from '@telegram-apps/sdk-vue';
import { formatMiniAppCssVar, formatThemeParamsCssVar, formatViewportCssVar } from 'shared';

/**
 * Initializes the SDK.
 * @param options - execution options.
 */
export async function init(options: {
  debug: boolean;
  allowedParentOrigin: string;
  platform: 'ios' | 'android';
}) {
  targetOrigin.set(options.allowedParentOrigin);
  setDebug(options.debug);
  initSDK();

  // Initialize required components.
  restoreInitData();
  mountBackButton.ifAvailable();
  mountMainButton.ifAvailable();
  mountSecondaryButton.ifAvailable();

  if (mountSwipeBehavior.isAvailable()) {
    mountSwipeBehavior();
    disableVerticalSwipes();
  }

  if (mountMiniAppSync.isAvailable()) {
    mountMiniAppSync();
    bindThemeParamsCssVars(formatThemeParamsCssVar);
    bindMiniAppCssVars(formatMiniAppCssVar);
  }

  if (mountViewport.isAvailable()) {
    await mountViewport();
    bindViewportCssVars(formatViewportCssVar);
  }

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

  applyAndSub(themeParamsSecondaryBackgroundColor, color => {
    if (color) {
      [setMiniAppHeaderColor, setMiniAppBottomBarColor, setMiniAppBackgroundColor].forEach(setter => {
        setter.ifAvailable(color);
      });
    }
  });

  document.documentElement.dataset['platform'] = options.platform;
  applyAndSub(isThemeParamsDark, isDark => {
    document.documentElement.dataset['theme'] = isDark ? 'dark' : 'light';
  });
}
