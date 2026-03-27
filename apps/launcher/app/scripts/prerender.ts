import { postEvent, request2, retrieveLaunchParams } from '@tma.js/sdk-vue';

const { tgWebAppData, tgWebAppPlatform, tgWebAppThemeParams } = retrieveLaunchParams();
const languageCode = tgWebAppData?.user?.language_code || '';

document.documentElement.dataset['locale'] = ['en', 'ru'].includes(languageCode)
  ? languageCode
  : 'en';
document.documentElement.dataset['platform'] = ['macos', 'ios'].includes(tgWebAppPlatform)
  ? 'ios'
  : 'android';

(async () => {
  const themeParams = tgWebAppPlatform === 'ios'
    // We use this hack to fix a bug related to dark themes in iOS. For some reason, the initial
    // theme params state there is invalid and contains secondaryBgColor = bgColor. Requesting
    // theme params, the client sends as new ones with valid values.
    ? (await request2('web_app_request_theme', 'theme_changed')).theme_params
    : tgWebAppThemeParams;

  Object.entries(themeParams).forEach(([key, value]) => {
    if (value) {
      document.documentElement.style.setProperty(
        `--${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`,
        value,
      );
    }
  });

  const { bg_color: bgColor } = themeParams;
  if (bgColor) {
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });
    postEvent('web_app_set_background_color', { color: bgColor });
    postEvent('web_app_set_bottom_bar_color', { color: bgColor });
  }
})();
