import type { PageRootExpose } from '../_types';

export const {
  provide: providePageRoot,
  inject: injectPageRoot,
} = createProvide<PageRootExpose>('page-root');
