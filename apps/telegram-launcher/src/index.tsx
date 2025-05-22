/* @refresh reload */
// TODO: Optimize used CSS. The last we had the following CSS bundle size:
//  dist/assets/index-D6kFVHBQ.css       16.69 kB │ gzip:   3.58 kB
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
const startParam = launchParams.tgWebAppStartParam || '';
const debug = ['platformer_debug', 'p-debug'].some(v => startParam.includes(v)) || import.meta.env.DEV;
const eruda = startParam.includes('p-eruda') || import.meta.env.DEV;

init({
  debug,
  eruda,
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
    const logger = createLogger('Launcher (Platformer)', {
      textColor: 'white',
      bgColor: 'chocolate',
      shouldLog: debug,
    });

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
