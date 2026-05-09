import type { PiniaColadaOptions } from '@pinia/colada';
import { PiniaColadaRetry } from '@pinia/colada-plugin-retry';

export default {
  plugins: [
    PiniaColadaRetry({
      // TODO: Disable retries for some specific certain errors.
      retry: 3,
    }),
    // A plugin to track failed requests.
    ctx => {
      ctx.queryCache.$onAction(action => {
        if (action.name === 'setEntryState') {
          const [key, state] = action.args;
          if (state.error) {
            console.error('Query failed:', { key, error: state.error });
            // TODO: Add Sentry?
          }
        }
      });
    },
  ],
} satisfies PiniaColadaOptions;
