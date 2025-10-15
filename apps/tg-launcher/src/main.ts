import './mockDevEnv.ts';

import 'vue-ui/index.css';
import './assets/index.scss';

import { init as sentryInit } from '@sentry/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import {
  createLogger,
} from '@telegram-apps/sdk-vue';
import {
  retrieveLaunchParams,
  retrieveRawInitData,
  retrieveRawLaunchParams,
} from '@tma.js/bridge';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import { init } from '@/init.ts';

import Root from '@/components/Root.vue';
import type { Locale } from '@/types/common.ts';

const launchParams = retrieveLaunchParams();
const { tgWebAppPlatform: platform } = launchParams;
const startParam = launchParams.tgWebAppStartParam || '';
const debug = ['platformer_debug', 'p-debug'].some(v => startParam.includes(v))
  || import.meta.env.DEV;
const eruda = startParam.includes('p-eruda') || import.meta.env.DEV;

const logger = createLogger('🚀Launcher', {
  textColor: 'white',
  bgColor: '#7688FF',
  shouldLog: debug,
});
logger.forceLog('Logs prefixed with 🚀 are sent from the Platformer launcher');

try {
  const { initialColors } = await init({
    debug,
    eruda,
    mockForWebK: platform === 'web',
    mockForMacOS: platform === 'macos',
  });

  const rawLaunchParams = retrieveRawLaunchParams();
  const rawInitData = retrieveRawInitData();

  let locale: Locale = 'en';
  const { language_code: lang } = (retrieveLaunchParams().tgWebAppData || {}).user || {};
  if (lang === 'ru' || lang === 'en') {
    locale = lang;
  }

  const app = createApp(Root, {
    platform,
    rawLaunchParams,
    rawInitData,
    initialColors,
    logger,
    locale,
  });

  sentryInit({
    app,
    enabled: !!import.meta.env.VITE_SENTRY_ENABLED,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });

  app
    .use(VueQueryPlugin)
    .use(createI18n({ locale, legacy: false }))
    .mount('#app');
} catch (error) {
  // TODO: Should properly handle the error.
  console.error(error);
}
