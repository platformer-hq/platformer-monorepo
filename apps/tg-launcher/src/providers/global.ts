import type { Logger, Platform } from '@telegram-apps/sdk-vue';
import { inject, type InjectionKey, provide } from 'vue';

import type { InitialColorsTuple, Locale } from '@/types/common.ts';

function createProviderTuple<V>(): [provide: (value: V) => void, inject: () => V] {
  const k = Symbol() as InjectionKey<V>;
  return [
    v => {
      provide(k, v);
    },
    () => {
      const injected = inject(k);
      if (injected === undefined) {
        throw new Error('Value was not provided');
      }
      return injected;
    },
  ];
}

export const [provideGlobals, injectGlobals] = createProviderTuple<{
  platform: Platform;
  initialColors: InitialColorsTuple;
  logger: Logger;
  locale: Locale;
}>();

export function injectLogger() {
  return injectGlobals().logger;
}
