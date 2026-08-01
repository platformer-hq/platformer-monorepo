import type { KnownPlatform } from '~ui-kit/types';

export const {
  inject: injectUiKitPlatform,
  provide: provideUiKitPlatform,
} = createProvide<MaybeRefOrGetter<KnownPlatform>>('platform');
