import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#cloud-storage': path.resolve(import.meta.dirname, 'app'),
  },
});
