import { createLogger, type Logger } from '@mini-apps/toolkit';
import { signal } from '@mini-apps/signals';

import { debug } from '@/debug.js';

export type { Logger };
export const logger = signal<Logger>(createLogger('Bridge', {
  bgColor: 'forestgreen',
  textColor: 'white',
  shouldLog() {
    return debug;
  },
}));
