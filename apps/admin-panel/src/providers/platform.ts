import { createProviderTuple } from './createProviderTuple.js';

export const [providePlatform, injectPlatform] = createProviderTuple<'ios' | 'android'>();
