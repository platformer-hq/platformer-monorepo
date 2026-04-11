import path from 'node:path';

export default defineNuxtConfig({
  alias: {
    '#app-roles': path.resolve(import.meta.dirname, 'app'),
  },
});
