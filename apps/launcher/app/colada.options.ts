import type { PiniaColadaOptions } from '@pinia/colada';
import { PiniaColadaRetry } from '@pinia/colada-plugin-retry';

export default {
  plugins: [
    PiniaColadaRetry({ retry: 3 }),
  ],
} satisfies PiniaColadaOptions;
