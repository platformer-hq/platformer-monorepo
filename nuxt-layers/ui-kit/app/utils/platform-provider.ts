import type { KnownPlatform } from '~/types';

export const {
  inject: injectUiKitPlatform,
  provide: provideUiKitPlatform,
} = createProvider<MaybeRefOrGetter<KnownPlatform>>();
