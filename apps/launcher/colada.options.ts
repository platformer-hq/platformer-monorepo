import { type PiniaColadaOptions, PiniaColadaQueryHooksPlugin } from '@pinia/colada';
import { PiniaColadaRetry } from '@pinia/colada-plugin-retry';

export default {
  plugins: [
    PiniaColadaRetry(),
    PiniaColadaQueryHooksPlugin({
      onError(error, entry) {
        console.error('Query failed:', { key: entry.key, error });
        // TODO: Add Sentry?
      },
    }),
  ],
} satisfies PiniaColadaOptions;
