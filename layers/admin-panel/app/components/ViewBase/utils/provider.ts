import type { ViewBaseExpose } from '../types';

export const [
  provideViewBaseContext,
  injectViewBaseContext,
] = createProviderTuple<ViewBaseExpose>();
