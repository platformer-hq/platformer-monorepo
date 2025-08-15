// This script optimizes icons, placed in the "icons" folder.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const sourceDir = resolve(dirname(fileURLToPath(import.meta.url)), '../icons');
const targetDir = resolve(sourceDir, '../src/icons');

// Re-create the target directory.
rmSync(targetDir, { recursive: true });
mkdirSync(targetDir);

// List of collected components.
const collectedComponents = [];

function getComponent(name, size, svg) {
  return `<script setup lang="ts">
/* eslint-disable */
import type { SVGAttributes } from 'vue';

export interface ${name}Props extends /* @vue-ignore */ SVGAttributes {
  size?: string | number;
}

const { size = ${size} } = defineProps<${name}Props>();
</script>

<template>
  ${svg
    .replace(/([{}])/g, '{\'$1\'}')
    .replace(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
    .replace(/(<svg[^>]*)>/i, '$1 :width="size" :height="size">')}
</template>`;
}

readdirSync(sourceDir).forEach(category => {
  mkdirSync(resolve(targetDir, category));

  readdirSync(resolve(sourceDir, category)).forEach(size => {
    mkdirSync(resolve(targetDir, category, size));

    readdirSync(resolve(sourceDir, category, size)).forEach(file => {
      // Optimize SVG.
      const { data: svg } = optimize(
        readFileSync(resolve(sourceDir, category, size, file)).toString(),
        {
          multipass: true,
          plugins: [
            'preset-default',
            'removeDimensions',
            'removeViewBox',
            'removeXlink',
            // Replace static colors which were meant to be dynamic to really dynamic.
            // https://svgo.dev/docs/plugins/convert-colors/
            {
              name: 'convertColors',
              params: {
                currentColor: new RegExp(`(${[
                  'black',
                  '#FF3B30',
                  '#007AFF',
                  '#000',
                  '#000000',
                  '#FF9500',
                  '#30B0C7',
                  '#34C759',
                  '#FF2D55',
                  '#FC0',
                  '#32ADE6',
                  '#AF52DE',
                  '#8E8E93',
                  '#8E8E93',
                  '#AEAEB2',
                ].join('|')})`),
              },
            },
          ],
        },
      );

      // Compute component name.
      const component = parse(file)
        .name
        .trim()
        // "Gear@Android" -> "Gear Android"
        // "QR Code-1" -> "QR Code 1"
        .replace(/[@-]/g, ' ')
        // "Left&Right" -> "LeftAndRight"
        .replace(/&/g, 'And')
        // "Gear     Android" -> "Gear Android
        .replace(/ {2,}/g, ' ')
        // "X(Twitter)" -> "Twitter"
        .replace(/X ?\(Twitter\)/g, 'Twitter')
        .split(' ')
        // "face id" -> "FaceId", "Face ID" -> "FaceID"
        .map(part => part[0].toUpperCase() + part.slice(1))
        .join('') + size;
      collectedComponents.push([category, size, component]);

      // Write Solid component.
      writeFileSync(
        resolve(targetDir, category, size, `${component}.vue`),
        getComponent(component, size, svg),
      );
    });
  });
});

// Write Vue components index file.
writeFileSync(
  resolve(targetDir, 'index.ts'),
  '/* eslint-disable */\n'
  + collectedComponents.map(([category, size, component]) => {
    return `export { default as ${component}, type ${component}Props } from './${category}/${size}/${component}.vue';\n`;
  })
    .sort()
    .join('\n') + '\n',
);
