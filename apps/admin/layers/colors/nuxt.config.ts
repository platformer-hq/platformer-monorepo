import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#colors': path.resolve(import.meta.dirname, 'app'),
  },
});
