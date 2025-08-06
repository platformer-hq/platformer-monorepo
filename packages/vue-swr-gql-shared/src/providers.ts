import { injectLocal, provideLocal } from '@vueuse/core';
import type { InjectionKey, MaybeRefOrGetter } from 'vue';

export interface GqlStoreOptions {
  endpoint: MaybeRefOrGetter<string>;
  authToken?: MaybeRefOrGetter<string>;
}

const key = Symbol() as InjectionKey<GqlStoreOptions>;

export function provideGqlOptions(value: GqlStoreOptions): void {
  provideLocal(key, value);
}

export function injectGqlOptions(): GqlStoreOptions {
  const injected = injectLocal(key);
  if (!injected) {
    throw new Error('Gql options not provided');
  }
  return injected;
}
