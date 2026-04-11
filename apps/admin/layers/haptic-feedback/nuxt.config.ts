import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#haptic-feedback': path.resolve(import.meta.dirname, 'app'),
  },
});
