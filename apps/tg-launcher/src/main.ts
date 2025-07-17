import './mockDevEnv.ts';

import 'vue-ui/index.css';
import './assets/index.scss';

import { createApp } from 'vue';
import {
  retrieveLaunchParams,
  retrieveRawInitData,
  retrieveRawLaunchParams,
  createLogger,
} from '@telegram-apps/sdk-vue';
import { init as sentryInit } from '@sentry/vue';
import { createI18n } from 'vue-i18n';

import { init } from '@/init.ts';

import Root from '@/components/Root/Root.vue';
import type { Locale } from '@/types/common.ts';

const launchParams = retrieveLaunchParams();
const { tgWebAppPlatform: platform } = launchParams;
const startParam = launchParams.tgWebAppStartParam || '';
const debug = ['platformer_debug', 'p-debug'].some(v => startParam.includes(v)) || import.meta.env.DEV;
const eruda = startParam.includes('p-eruda') || import.meta.env.DEV;

try {
  const { initialColors } = await init({
    debug,
    eruda,
    mockForWebK: platform === 'web',
    mockForMacOS: platform === 'macos',
  });

  const rawLaunchParams = retrieveRawLaunchParams();
  const rawInitData = retrieveRawInitData();
  const logger = createLogger('Platformer', {
    textColor: 'white',
    bgColor: 'chocolate',
    shouldLog: debug,
  });

  let locale: Locale = 'en';
  const { language_code: lang } = (retrieveLaunchParams().tgWebAppData || {}).user || {};
  if (lang === 'ru' || lang === 'en') {
    locale = lang;
  }

  const app = createApp(Root, {
    debug,
    platform,
    rawLaunchParams,
    rawInitData,
    initialColors,
    logger,
    locale,
  });
  // TODO: make it async
  sentryInit({
    app,
    dsn: 'https://8888815a88eb8e06bd1ac55195df9ab0@o992980.ingest.us.sentry.io/4508812774473728',
    environment: import.meta.env.MODE,
  });

  app
    .use(createI18n({ locale, legacy: false }))
    .mount('#app');
} catch (error) {
  // TODO: Should properly handle the error.
  console.error(error);
}