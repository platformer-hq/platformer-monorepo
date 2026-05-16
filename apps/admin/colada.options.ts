import { type PiniaColadaOptions, PiniaColadaQueryHooksPlugin } from '@pinia/colada';
import { PiniaColadaRetry } from '@pinia/colada-plugin-retry';

export default {
  plugins: [
    PiniaColadaRetry({
      // TODO: Disable retries for some specific certain errors.
      retry: 3,
    }),
    PiniaColadaQueryHooksPlugin({
      onError(error, entry) {
        console.error('Query failed:', { key: entry.key, error });
        // TODO: Add Sentry?
      },
    }),
  ],
} satisfies PiniaColadaOptions;
