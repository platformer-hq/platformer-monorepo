import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  $meta: {
    name: 'colors',
  },
  alias: {
    '~colors': resolve('app'),
  },
  css: [
    resolve('./app/assets/generated.scss'),
  ],
});
