import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  alias: {
    '~colors': resolve('app'),
  },
  $meta: {
    name: 'colors',
  },
  css: [
    resolve('./app/assets/generated.scss'),
    resolve('./app/assets/color-vars.scss'),
  ],
});
