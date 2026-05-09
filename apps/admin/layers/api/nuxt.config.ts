import path from 'node:path';

function resolve(...p: string[]) {
  return path.resolve(import.meta.dirname, ...p);
}

export default defineNuxtConfig({
  alias: {
    '#api': resolve('app'),
  },
  imports: {
    dirs: [resolve('app/stores/*.ts')],
  },
});
