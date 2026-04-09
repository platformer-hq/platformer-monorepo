// This script creates Vue components from icons' SVG resources.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { parse, resolve } from 'node:path';
import { optimize, type PluginConfig } from 'svgo';

const sourceDir = resolve(import.meta.dirname, 'icons');
const targetDir = resolve(import.meta.dirname, 'src/icons');

// Config related to each directory.
const dirsConfig: Record<string, {
  monochrome?: boolean;
  prefix?: string;
}> = {
  icons: {
    monochrome: true,
  },
  ios: {
    prefix: 'Ios',
    monochrome: true,
  },
};

// Re-create the target directory.
rmSync(targetDir, { recursive: true });
mkdirSync(targetDir);

// List of collected components.
const collectedComponents: { name: string; path: string }[] = [];

/**
 * @returns A Vue component code content rendering the SVG.
 */
function getComponentCode(options: {
  name: string;
  size: number;
  svg: string;
}): string {
  return `<script setup lang="ts">
/* eslint-disable */
export interface ${options.name}Props {
  size?: string | number;
}

const { size = ${options.size} } = defineProps<${options.name}Props>();
</script>

<template>
  ${options.svg
    .replace(/([{}])/g, '{\'$1\'}')
    .replace(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
    .replace(/(<svg[^>]*)>/i, '$1 :width="size" :height="size">')}
</template>`;
}

/**
 * Optimizes the SVG content.
 */
function optimizeSvg(options: {
  svg: string;
  monochrome?: boolean;
}) {
  // Optimize SVG.
  const plugins: PluginConfig[] = [
    'preset-default',
    'removeDimensions',
    'removeViewBox',
    'removeXlink',
  ];
  if (options.monochrome) {
    plugins.push({
      name: 'convertColors',
      params: {
        currentColor: new RegExp(`(${[
          'black',
          'white',
          '#fff',
          '#FF3B30',
          '#007AFF',
          '#222',
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
          '#AEAEB2',
        ].join('|')})`, 'i'),
      },
    });
  }
  return optimize(options.svg, { multipass: true, plugins }).data;
}

// Read all directories and process them.
readdirSync(sourceDir).forEach(category => {
  const config = dirsConfig[category];
  mkdirSync(resolve(targetDir, category));

  readdirSync(resolve(sourceDir, category)).forEach(size => {
    mkdirSync(resolve(targetDir, category, size));

    const sizeNum = parseInt(size);
    readdirSync(resolve(sourceDir, category, size)).forEach(fileName => {
      const componentName = 'Icon'
        + (config?.prefix || '')
        + parse(fileName)
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
          .map(part => part[0]!.toUpperCase() + part.slice(1))
          .join('')
          + size;
      collectedComponents.push({
        name: componentName,
        path: [category, size].join('/'),
      });

      writeFileSync(
        resolve(targetDir, category, size, `${componentName}.vue`),
        getComponentCode({
          name: componentName,
          size: sizeNum,
          svg: optimizeSvg({
            svg: readFileSync(resolve(sourceDir, category, size, fileName)).toString(),
            monochrome: config?.monochrome,
          }),
        }),
      );
    });
  });
});

// Write collected Vue components index file.
writeFileSync(
  resolve(targetDir, 'index.ts'),
  '/* eslint-disable */\n'
  + collectedComponents.map(({ name, path }) => {
    return `export { default as ${name}, type ${name}Props } from './${path}/${name}.vue';\n`;
  })
    .sort()
    .join('') + '\n',
);
