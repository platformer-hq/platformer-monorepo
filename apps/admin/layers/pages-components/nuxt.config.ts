import path from 'node:path';

function resolve(...filePath: string[]) {
  return path.resolve(__dirname, ...filePath);
}

export default defineNuxtConfig({
  components: [{
    path: resolve('app/components'),
    extensions: ['.vue'],
    ignore: ['**/_/**', '**/_*'],
  }],
  imports: {
    dirs: [
      resolve('app/components/*/composables/**'),
    ],
  },
});
