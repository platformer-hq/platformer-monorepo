import { inject, type InjectionKey, provide } from 'vue';

interface ProvidedValue {
  endpoint: string;
  authToken?: string;
}

const key = Symbol() as InjectionKey<ProvidedValue>;

export function provideGqlOptions(value: ProvidedValue): void {
  provide(key, value);
}

export function injectGqlOptions(): ProvidedValue {
  const injected = inject(key);
  if (!injected) {
    throw new Error('Gql options not provided');
  }
  return injected;
}
