import path from 'node:path';
import { defineNuxtConfig } from 'nuxt/config';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  alias: {
    '~scss': resolve('app'),
  },
  $meta: {
    name: 'scss',
  },
});
