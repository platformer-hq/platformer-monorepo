import { postEvent, retrieveLaunchParams, isColorDark } from '@tma.js/sdk-vue';

const { tgWebAppThemeParams } = retrieveLaunchParams();

// Set initial CSS variables related to the theme.
Object.entries(tgWebAppThemeParams).forEach(([key, value]) => {
  if (value) {
    document.documentElement.style.setProperty(
      `--${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`,
      value,
    );
  }
});

document.documentElement.dataset['platform'] = /Macintosh|Mac OS X|MacIntel|iPad|iPhone|iPod/.test(navigator.userAgent)
  ? 'ios'
  : 'android';
document.documentElement.dataset['theme'] = tgWebAppThemeParams.bg_color && isColorDark(tgWebAppThemeParams.bg_color)
  ? 'dark'
  : 'light';

// TODO: Save theme params changes.

const { bg_color: bgColor } = tgWebAppThemeParams;
if (bgColor) {
  postEvent('web_app_set_header_color', { color_key: 'bg_color' });
  postEvent('web_app_set_background_color', { color: bgColor });
  postEvent('web_app_set_bottom_bar_color', { color: bgColor });
}
