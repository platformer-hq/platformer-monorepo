import { injectLocal, provideLocal } from '@vueuse/core';
import type { InjectionKey } from 'vue';

export function createProviderTuple<V>(): [provide: (value: V) => void, inject: () => V] {
  const k = Symbol() as InjectionKey<V>;
  return [
    v => {
      provideLocal(k, v);
    },
    () => {
      const injected = injectLocal(k);
      if (injected === undefined) {
        throw new Error('Value was not provided');
      }
      return injected;
    },
  ];
}
