import { injectLocal, provideLocal } from '@vueuse/core';
import type { InjectionKey } from 'vue';

/**
 * @returns A set of utilities to provide and inject a value.
 */
/* @__NO_SIDE_EFFECTS__ */
export function createProvide<TValue>(key: string) {
  const k = Symbol(key) as InjectionKey<TValue>;

  return {
    provide(v: TValue) {
      provideLocal(k, v);
    },
    inject(): TValue {
      const value = injectLocal(k);
      if (value === undefined) {
        throw new Error(`Value for key "${key}" was not provided`);
      }
      return value;
    },
  };
}
