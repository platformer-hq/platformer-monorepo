import { h, type Component } from 'vue';

import type { KnownPlatform } from '../types.js';

interface Options<C> extends Partial<Record<KnownPlatform, C>> {
  common: C;
}

export function platformed<C extends Component>({ common, ios, android }: Options<C>): C {
  // @ts-expect-error TODO: research the problem
  return ((props, options) => {
    const store = useTmaStore();
    return h(
      ({ android, ios })[store.platform.mapped] || common,
      props,
      options.slots,
    );
  });
}
