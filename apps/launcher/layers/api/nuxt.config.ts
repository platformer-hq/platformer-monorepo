import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  alias: {
    '~api': resolve('app'),
  },
  $meta: {
    name: 'api',
  },
  imports: {
    dirs: [
      resolve('app/stores/*.ts'),
    ],
  },
});
