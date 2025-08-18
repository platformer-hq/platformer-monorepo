import 'vue-ui/index.css';
import './styles/global.android.scss';
import './styles/global.common.scss';
import './styles/global.ios.scss';

import { init as sentryInit } from '@sentry/vue';
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import {
  hapticFeedbackNotificationOccurred,
  retrieveLaunchParams,
  retrieveRawInitData,
} from '@telegram-apps/sdk-vue';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import Root from './core/components/Root/Root.vue';
import { isKnownLocale } from './i18n/helpers/isKnownLocale.js';
import type { KnownLocale } from './i18n/types.js';
import { init } from './init.js';
import { createAppRouter } from './navigation/createAppRouter.js';

const lp = retrieveLaunchParams();
const { tgWebAppPlatform } = lp;
const platform: 'ios' | 'android' = ['ios', 'macos'].includes(tgWebAppPlatform) ? 'ios' : 'android';
// const platform = 'ios';

init({
  allowedParentOrigin: import.meta.env.PROD ? 'https://tgl.mini-apps.store' : '*',
  debug: (lp.tgWebAppStartParam || '').includes('debug') || import.meta.env.DEV,
  platform,
})
  .then(() => {
    let locale: KnownLocale = 'en';
    const { language_code: lang } = (lp.tgWebAppData || {}).user || {};
    if (lang && isKnownLocale(lang)) {
      locale = lang;
    }

    const app = createApp(Root, {
      endpoint: import.meta.env.DEV ? '/api/gql' : 'https://mini-apps.store/api/gql',
      platform,
      // TODO: Verify init data existence.
      initData: retrieveRawInitData()!,
      appVersion: import.meta.env.APP_VERSION,
    });

    sentryInit({
      app,
      enabled: !!import.meta.env.VITE_SENTRY_ENABLED,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
    });

    app
      .use(VueQueryPlugin, {
        queryClient: new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 600_000,
              retry: 3,
              retryDelay: failureCount => Math.pow(2, failureCount - 1) * 100,
              refetchOnMount: 'always',
              // @ts-expect-error Something is wrong with the lib types.
              persister: experimental_createQueryPersister({
                storage: sessionStorage,
                maxAge: 60 * 60 * 1000,
              }).persisterFn,
            },
            mutations: {
              onError() {
                hapticFeedbackNotificationOccurred('error');
              },
            },
          },
        }),
      })
      .use(createI18n({
        locale,
        legacy: false,
        pluralRules: {
          ru(count, choicesLength) {
            const choiceFn = (count: number) => {
              return () => {
                if (Math.min(count, choicesLength) !== count) {
                  console.error(`unable to find i18n choice for count "${count}"`);
                }
                return count;
              };
            };
            const zero = choiceFn(0);
            if (count === 0) {
              return zero();
            }
            const one = choiceFn(1);
            const two = choiceFn(2);
            const many = choiceFn(3);
            return (count % 100 > 4 && count % 100 < 20)
              ? many()
              : [many, one, two, two, two, many][Math.min(count % 10, 5)]();
          },
        },
      }))
      .use(createAppRouter())
      .mount('#app');
  })
  .catch(error => {
    // TODO: Should properly handle the error.
    console.error(error);
  });
