import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#i18n-layer': path.resolve(import.meta.dirname, 'app'),
  },
});
