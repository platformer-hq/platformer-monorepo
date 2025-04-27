import type { RGB } from '@telegram-apps/sdk-solid';
import type { Logger as UtilsLogger } from 'utils';

export type Locale = 'en' | 'ru';

export type Logger = Pick<UtilsLogger, 'log' | 'error' | 'forceError' | 'forceWarn'>;

export type InitialColorsTuple = [
  header: RGB | string,
  background: RGB | undefined,
  bottomBar: RGB | undefined
];