import { inject, type InjectionKey, provide } from 'vue';
import type { DataCache, RevalidationCache, ObserversCache } from 'vue-swr';

export interface ProviderValue {
  dataCache: DataCache<unknown>;
  revalidationCache: RevalidationCache<unknown>;
  observersCache: ObserversCache<unknown, unknown>;
}

const key = Symbol() as InjectionKey<ProviderValue>;

const globalStoreOptions: ProviderValue = {
  dataCache: new Map(),
  revalidationCache: new Map(),
  observersCache: new Map(),
};

export function provideSWRStoreOptions(value?: Partial<ProviderValue>): void {
  value ||= {};
  provide(key, {
    dataCache: value.dataCache || globalStoreOptions.dataCache,
    revalidationCache: value.revalidationCache || globalStoreOptions.revalidationCache,
    observersCache: value.observersCache || globalStoreOptions.observersCache,
  });
}

export function injectSWRStoreOptions(): ProviderValue {
  return inject(key) || globalStoreOptions;
}