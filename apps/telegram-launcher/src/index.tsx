/* @refresh reload */
import 'ui/index.css';

import { render } from 'solid-js/web';
import {
  retrieveLaunchParams,
  retrieveRawInitData,
  retrieveRawLaunchParams,
} from '@telegram-apps/sdk-solid';
import { createLogger } from 'utils';

import { Root } from '@/components/Root/Root.js';
import { init } from '@/init.js';
import type { Locale } from '@/types/common.js';

import './index.scss';
import './mockEnv.js';

const launchParams = retrieveLaunchParams();
const { tgWebAppPlatform: platform } = launchParams;
const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug') || import.meta.env.DEV;

init({
  debug,
  eruda: debug && ['ios', 'android'].includes(platform),
  mockForWebK: platform === 'web',
  mockForMacOS: platform === 'macos',
  sentry: {
    dsn: 'https://8888815a88eb8e06bd1ac55195df9ab0@o992980.ingest.us.sentry.io/4508812774473728',
    environment: import.meta.env.MODE,
  },
})
  .then(({ initialColors }) => {
    const rawLaunchParams = retrieveRawLaunchParams();
    const rawInitData = retrieveRawInitData();
    const noop = () => {
    };
    const logger = debug
      ? createLogger('@platformer / Launcher', ['white', 'chocolate'])
      : {
        log: noop,
        group: noop,
        groupEnd: noop,
      };

    let locale: Locale = 'en';
    const { language_code: lang } = (retrieveLaunchParams().tgWebAppData || {}).user || {};
    if (lang === 'ru' || lang === 'en') {
      locale = lang;
    }

    render(() => (
      <Root
        debug={debug}
        platform={platform}
        rawLaunchParams={rawLaunchParams}
        rawInitData={rawInitData}
        initialColors={initialColors}
        logger={logger}
        locale={locale}
      />
    ), document.getElementById('app')!);
  })
  .catch(error => {
    // TODO: Should properly handle the error.
    console.error(error);
  });
