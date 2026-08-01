import type { PageRootExpose } from '../_types';

export const {
  provide: providePageRootContext,
  inject: injectPageRootContext,
} = createProvider<PageRootExpose>();
