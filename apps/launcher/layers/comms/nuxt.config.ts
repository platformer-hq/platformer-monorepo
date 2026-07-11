import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  alias: {
    '~comms': resolve('app'),
  },
  $meta: {
    name: 'comms',
  },
});
