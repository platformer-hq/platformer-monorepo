import { injectLocal, provideLocal } from '@vueuse/core';
import type { InjectionKey } from 'vue';

/**
 * @returns A set of utilities to provide and inject a value.
 */
/* @__NO_SIDE_EFFECTS__ */
export function createProvider<V>() {
  const k = Symbol() as InjectionKey<V>;

  function inject(): V | undefined;
  function inject(defaultValue: V): V;
  function inject(defaultValue?: V): V | undefined {
    return injectLocal(k, defaultValue);
  }

  return {
    provide(v: V) {
      provideLocal(k, v);
    },
    inject,
  };
}
