/* @refresh reload */
import { render } from 'solid-js/web';
import { retrieveLaunchParams } from '@telegram-apps/sdk-solid';

import { Root } from '@/components/Root/Root.js';
import { init } from '@/init.js';

import './index.scss';
import './mockEnv.js';

const { tgWebAppPlatform: platform, tgWebAppStartParam: startParam } = retrieveLaunchParams();
const debug = (startParam || '').includes('platformer_debug') || import.meta.env.DEV;

init({
  debug,
  eruda: debug && ['ios', 'android'].includes(platform),
  mockForMacOS: platform === 'macos',
  sentry: {
    dsn: 'https://8888815a88eb8e06bd1ac55195df9ab0@o992980.ingest.us.sentry.io/4508812774473728',
    environment: import.meta.env.MODE,
  },
})
  .then(({ initialColors }) => {
    render(() => (
      <Root
        debug={debug}
        platform={platform}
        // platform="ios"
        initialColors={initialColors}
      />
    ), document.getElementById('app')!);
  })
  .catch(error => {
    // TODO: Should properly handle the error.
    console.error(error);
  });
