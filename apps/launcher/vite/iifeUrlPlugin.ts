/* eslint-disable @typescript-eslint/no-explicit-any */
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import type { ViteOptions } from 'nuxt/schema';
import { rollup } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

type VitePlugin = Exclude<ViteOptions['plugins'], undefined> extends (infer T)[]
  ? Exclude<Extract<T, object>, PromiseLike<any> | any[]>
  : never;

type ResolvedConfig = Parameters<
  Extract<Exclude<VitePlugin['configResolved'], undefined>, (...args: any) => any>
>[0];

export function iifeUrlPlugin(): VitePlugin {
  let config: ResolvedConfig;

  return {
    name: 'iife-url',
    // enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async load(id) {
      const [url, search] = id.split('?', 2);
      if (!url || !search) {
        return;
      }
      const query = new URLSearchParams(search);
      if (!query.has('iife-url')) {
        return;
      }

      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        if (!query.has('process')) {
          query.append('process', '');
          return 'export default ' + JSON.stringify(
            `${path.join(config.base, path.relative(config.root, url))}?${query.toString()}`,
          );
        }
      }

      const { output: [{ code }] } = await (
        await rollup({
          input: url,
          external: [],
          treeshake: true,
          onwarn(warning, warn) {
            // TODO: This will ignore such warnings as "Module not found". At the moment, we
            // have some troubles relate to ".vue" modules, this plugin attempts to compute
            // their type, but is not able to.
            //
            // Warning "THIS_IS_UNDEFINED" appears when rollup attempts to parse fp-ts
            // packages. We temp disable them also.
            if (warning.pluginCode !== 'TS2307' && warning.code !== 'THIS_IS_UNDEFINED') {
              warn(warning);
            }
          },
          plugins: [
            {
              name: 'raw-loader',
              load(id) {
                if (id.endsWith('?raw')) {
                  return this.fs.readFile(id.replace('?raw', ''), { encoding: 'utf8' });
                }
              },
              transform(code, id) {
                if (id.endsWith('?raw')) {
                  return {
                    code: `export default ${JSON.stringify(code)};`,
                    map: { mappings: '' },
                  };
                }
              },
            },
            typescript(),
            alias({ entries: [{ find: '@', replacement: config.root }] }),
            resolve({ browser: true, extensions: ['.js', '.ts'] }),
            esbuild({ sourceMap: false, minify: !isDev }),
          ],
        })
      )
        .generate({
          format: 'iife',
          sourcemap: false,
          compact: !isDev,
        });
      if (isDev) {
        return code;
      }
      const referenceId = this.emitFile({
        type: 'asset',
        name: path.parse(url).name + '.js',
        source: code,
      });
      if (config.ssr) {
        return `
        const url = import.meta.ROLLUP_FILE_URL_${referenceId};
        export default url.slice(url.indexOf('_nuxt') - 1)`;
      }
      return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`;
    },
  };
}
