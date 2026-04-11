import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#navigation': path.resolve(import.meta.dirname, 'app'),
  },
});
