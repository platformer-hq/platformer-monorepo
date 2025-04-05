import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';
import { imagePlugin } from 'vite-plugins';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
  plugins: [
    // Uncomment the following line to enable solid-devtools.
    // For more info see
    // https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme devtools(),
    solidPlugin(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Create a custom SSL certificate valid for the local machine.
    // https://www.npmjs.com/package/vite-plugin-mkcert
    process.env.HTTPS ? mkcert() : undefined,
    imagePlugin(),
  ],
  build: {
    target: 'esnext',
  },
  publicDir: './public',
  server: {
    proxy: {
      '/gql': 'http://localhost:10000',
    },
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
  },
});
