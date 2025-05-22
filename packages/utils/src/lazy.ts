import type { Config } from 'mixpanel-browser';
import type { BrowserOptions } from '@sentry/solid';

export type MixpanelConfig = Config;

export function lazyMixpanelInit(token: string, config?: Partial<MixpanelConfig>) {
  return import('mixpanel-browser').then(({ default: mixpanel }) => {
    mixpanel.init(token, config);
  });
}

export function lazySentryInit(options: BrowserOptions) {
  return import('./initSentry.js').then(({ init }) => {
    init(options);
  });
}

export function lazyErudaInit() {
  return import('eruda').then(({ default: eruda }) => {
    eruda.init();
    eruda.position({ x: window.innerWidth - 50, y: window.innerHeight / 2 });
  });
}