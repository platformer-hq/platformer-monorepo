import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#api': path.resolve(import.meta.dirname, 'app'),
  },
});
