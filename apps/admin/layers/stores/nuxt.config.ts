import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#stores': path.resolve(import.meta.dirname, 'app'),
  },
});
