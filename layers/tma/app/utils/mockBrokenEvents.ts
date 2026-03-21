import { emitEvent, mockTelegramEnv, themeParams, viewport } from '@tma.js/sdk-vue';

/**
 * Intercepts broken Telegram Mini Apps events and responds with a correct data.
 *
 * This. function requires viewport and theme params to be mounted.
 */
export function interceptBrokenEvents(options: {
  macOS: boolean;
  webK: boolean;
}) {
  if (!options.macOS && !options.webK) {
    return;
  }
  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even respond to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  //
  // In turn, Telegram Web K doesn't respond to both "web_app_request_safe_area" and
  // "web_app_request_content_safe_area" methods. That's why we have to intercept some of these
  // calls in order to get an expected behavior.
  const noInsets = { left: 0, top: 0, right: 0, bottom: 0 };
  mockTelegramEnv({
    onEvent(event, next) {
      if (options.macOS) {
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
      if (options.webK) {
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
