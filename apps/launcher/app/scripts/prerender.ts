import { postEvent, retrieveLaunchParams } from '@tma.js/sdk-vue';

const { tgWebAppData, tgWebAppPlatform, tgWebAppThemeParams } = retrieveLaunchParams();
const languageCode = tgWebAppData?.user?.language_code || '';

document.documentElement.dataset['locale'] = ['en', 'ru'].includes(languageCode)
  ? languageCode
  : 'en';
document.documentElement.dataset['platform'] = ['macos', 'ios'].includes(tgWebAppPlatform)
  ? 'ios'
  : 'android';

Object.entries(tgWebAppThemeParams).forEach(([key, value]) => {
  if (value) {
    document.documentElement.style.setProperty(
      `--tg-theme-${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`,
      value,
    );
  }
});

// TODO: Save theme params changes.

const { bg_color: bgColor } = tgWebAppThemeParams;
if (bgColor) {
  postEvent('web_app_set_header_color', { color_key: 'bg_color' });
  postEvent('web_app_set_background_color', { color: bgColor });
  postEvent('web_app_set_bottom_bar_color', { color: bgColor });
}
