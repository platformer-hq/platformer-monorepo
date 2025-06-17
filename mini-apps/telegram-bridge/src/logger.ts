import { createLogger, type Logger } from '@mini-apps/toolkit';
import { signal } from '@mini-apps/signals';

import { debug } from '@/debug.js';

export const logger = signal<Logger>(createLogger('Bridge', {
  bgColor: '#9147ff',
  textColor: 'white',
  shouldLog() {
    return debug;
  },
}));
