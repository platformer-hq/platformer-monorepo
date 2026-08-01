import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  $meta: {
    name: 'tma',
  },
  alias: {
    '~tma': resolve('app'),
  },
  extends: ['@workspace-layers/utils'],
});
