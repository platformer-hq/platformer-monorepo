import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#platform': path.resolve(import.meta.dirname, 'app'),
  },
});
