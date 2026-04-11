import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#auto-components': path.resolve(import.meta.dirname, 'app'),
  },
});
