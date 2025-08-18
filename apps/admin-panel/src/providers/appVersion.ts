import { createProviderTuple } from './createProviderTuple.js';

export const [provideAppVersion, injectAppVerison] = createProviderTuple<string>();
