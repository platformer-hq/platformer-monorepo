import { injectLocal, provideLocal } from '@vueuse/core';
import type { InjectionKey } from 'vue';

export function createProvider<V>() {
  const k = Symbol() as InjectionKey<V>;
  return {
    provide(v: V) {
      provideLocal(k, v);
    },
    inject(): V {
      const injected = injectLocal(k);
      if (injected === undefined) {
        throw new Error('Value was not provided');
      }
      return injected;
    },
  };
}
