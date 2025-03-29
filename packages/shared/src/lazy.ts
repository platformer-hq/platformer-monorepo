import type { Config } from 'mixpanel-browser';
import type { BrowserOptions } from '@sentry/solid';

export function lazyMixpanelInit(token: string, config?: Partial<Config>) {
  return import('mixpanel-browser').then(({ default: mixpanel }) => {
    mixpanel.init(token, config);
  });
}

export function lazySentryInit(options: BrowserOptions) {
  return import('./initSentry.js').then(({ init }) => {
    init(options);
  });
}