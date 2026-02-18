import type { MaybeRefOrGetter } from 'vue';

import { createProviderTuple } from '@/providers/createProviderTuple.js';

export interface GqlOptions {
  endpoint: MaybeRefOrGetter<string>;
  authToken?: MaybeRefOrGetter<string>;
}

export const [provideGqlOptions, injectGqlOptions] = createProviderTuple<GqlOptions>();
