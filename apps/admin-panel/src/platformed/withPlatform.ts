import { h, type Component } from 'vue';

import { injectPlatform } from '@/providers/platform.js';

export function withPlatform<C extends Component>({ common, ios, android }: {
  common: C;
  ios?: C;
  android?: C;
}): C {
  // @ts-expect-error FIXME: research the problem
  return ((props, options) => {
    const platform = injectPlatform();
    return h(
      ({ android, ios } as const)[platform] || common,
      props,
      options.slots,
    );
  }) as any;
}
