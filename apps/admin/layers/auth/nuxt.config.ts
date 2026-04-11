import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#auth': path.resolve(import.meta.dirname, 'app'),
  },
});
